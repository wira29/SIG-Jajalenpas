

export async function getAduans() {
    try {
        const response = await fetch(`/api/aduan`);
        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAduanByRuasId(ruasId: string) {
    try {
        const response = await fetch(`/api/aduan/${ruasId}`);
        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}