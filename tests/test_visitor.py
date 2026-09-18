"""Exercise real visitor cookies and database-backed isolation against the local app."""
import json
import os
import unittest
import urllib.request
import urllib.error
import http.cookiejar

BASE = os.environ.get('VISITOR_URL', 'http://127.0.0.1:5218')
class Visitor:
    def __init__(self):
        self.client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    def request(self, path, method='GET', body=None, origin=BASE):
        headers={'Content-Type':'application/json','Origin':origin}
        request=urllib.request.Request(BASE+path, data=None if body is None else json.dumps(body).encode(), headers=headers, method=method)
        try: response=self.client.open(request,timeout=30)
        except urllib.error.HTTPError as error: response=error
        with response:
            data=response.read()
            try: result=json.loads(data)
            except ValueError: result=None
            return response.status,result

class VisitorTests(unittest.TestCase):
    def test_private_sessions_and_public_list_isolation(self):
        first, second = Visitor(), Visitor()
        self.assertEqual(first.request('/api/movieLists')[0],401)
        self.assertEqual(first.request('/api/demo/session','POST',origin='https://unrelated.invalid')[0],403)
        try:
            self.assertEqual(first.request('/api/demo/session','POST')[0],200)
            self.assertEqual(second.request('/api/demo/session','POST')[0],200)
            status, record=first.request('/api/movieLists','POST',{'title':'Private sample','description':'Synthetic','isPublic':True})
            self.assertEqual(status,201,record)
            identity=record['id']
            self.assertEqual(first.request('/api/movieLists/'+identity)[0],200)
            self.assertEqual(second.request('/api/movieLists/'+identity)[0],404)
            self.assertNotIn(identity,[x['id'] for x in second.request('/api/movieLists/public')[1]])
            self.assertEqual(second.request('/movieLists/'+identity)[0],404)
            self.assertEqual(first.request('/api/movies','POST',{'tmdb_id':999999999,'title':'Forbidden shared data'})[0],403)
            status,review=first.request('/api/reviews','POST',{'title':'A useful sample','review':'A fictional review for testing.','rating':8,'movie':{'connect':{'tmdb_id':910001}}})
            self.assertEqual(status,201,review)
            review_id=review['id']
            self.assertEqual(first.request('/api/reviews/'+review_id)[0],200)
            self.assertEqual(second.request('/api/reviews/'+review_id)[0],404)
            self.assertEqual(second.request('/reviews/'+review_id)[0],404)
            self.assertNotIn(review_id,[x['id'] for x in second.request('/api/reviews')[1]])
            self.assertEqual(second.request('/api/reviews/'+review_id+'/reaction','PUT',{'action':'LIKE'})[0],404)
            self.assertEqual(first.request('/api/demo/session','DELETE')[0],204)
            self.assertEqual(first.request('/api/movieLists')[0],401)
            self.assertEqual(second.request('/api/movieLists')[0],200)
        finally:
            first.request('/api/demo/session','DELETE')
            second.request('/api/demo/session','DELETE')

if __name__=='__main__':unittest.main(verbosity=2)
