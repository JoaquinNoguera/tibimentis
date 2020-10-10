type Story = {
    id: string,
    autorName: string,
    content: string,
    isPublic: boolean,
    title: string,
    userId: string,
    image?: string,
    imageM?: string,
}


type Stories =  Story[]

export{
    Story,
    Stories
}