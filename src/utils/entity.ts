export const getEntityType = (entity: string): string | undefined => {
    return {
        'exam': 'examEntity',
        'user': 'userEntity'
    }[entity]
}

export const getDocumentType = (entity: string): string | undefined => {
    return {
        'exam': 'user-exam-file',
        'user': 'user-profile-picture'
    }[entity]
}