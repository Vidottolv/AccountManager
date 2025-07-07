import api from './api';

export async function getPreferences() {
    const response = await api.get('/preferences');
    return response.data;
}

export async function postPreferences(commission: number, language: string) {
    console.log('no response')
    const response = await api.post('/preferences', {commission, language});
    return response.data;
}

export async function updatePreferences(commission: number, language: string, _id: string) {
    const response = await api.put(`/preferences/${_id}`, {commission, language});
    return response.data;
}