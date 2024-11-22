const baseURL = process.env.REACT_APP_API_URL;
export const urlLogin = `${baseURL}/login`;
export const urlRegister = `${baseURL}/register`;
export const urlDiscussions = `${baseURL}/mydiscussions`;
export const urlCreateDiscussion = `${baseURL}/create-discussion`;
export const urlAllDiscussions = `${baseURL}/discussions`;
export const urlUserDiscussions = `${baseURL}/userdiscussions`;
export const urlTopics = `${baseURL}/topics`;
export const urlTopicManagement = `${baseURL}/topicmanagement`;
export const urlTopicCreate = `${baseURL}/topic/create-topic`;
export const urlTopicEdit = `${baseURL}/topic/edit-topic`;
export const urlTopicDelete = `${baseURL}/topic/delete-topic`;
export const urlTopicDeleteSelected = `${baseURL}/topic/delete-selected-topic`;
export const urlUserInfo = `${baseURL}/userinfo`;
export const urlUserEdit = `${baseURL}/edituser`;
export const urlAddComment = `${baseURL}/add-comment`