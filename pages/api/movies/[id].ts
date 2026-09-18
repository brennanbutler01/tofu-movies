import { NextApiRequest, NextApiResponse } from 'next'
// Shared catalogue corrections require a trusted catalogue import, not an arbitrary user write.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    return void res
        .status(405)
        .json({ error: 'Direct catalogue updates are not supported' })
}
