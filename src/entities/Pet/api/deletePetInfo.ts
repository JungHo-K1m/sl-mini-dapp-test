import api from '@/shared/api/axiosInstance';

async function deletePet(petinfo: any, navigate: any): Promise<any> {
    const id = petinfo;
    console.log("Deleting pet with ID:", id);
    const url = `pet/${id}`;

    try {
        const response = await api.delete(url);

        if (response.data.code === 'OK') {
            return true;
        } else {
            throw new Error('Failed to delete pet: Unexpected response code');
        }
    } catch (error: any) {
        console.error('Error occurred:', error.message);
    }
}

export default deletePet;
