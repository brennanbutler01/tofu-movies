import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).json({
        err: 'Nothing found for this movie - if a record doesnt have an imdb id, omdb wont find it',
    })
}

export default handler
