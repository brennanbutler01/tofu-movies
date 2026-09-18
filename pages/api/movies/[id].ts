import { withVisitorGuard } from 'server/visitor'
import { NextApiRequest, NextApiResponse } from 'next'
// Shared catalogue corrections require a trusted catalogue import, not an arbitrary user write.
function handler(_req: NextApiRequest, res: NextApiResponse) {
    return void res
        .status(405)
        .json({ error: 'Direct catalogue updates are not supported' })
}

export default withVisitorGuard(handler)
