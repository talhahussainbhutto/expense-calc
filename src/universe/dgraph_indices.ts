export const indices = `
    amount: float . 
    date_added: int . 
    bvid: string @index(exact) .
    title: string @index(exact) . 
    date_lastEdit: int .
    entryType: string @index(exact) .
`
