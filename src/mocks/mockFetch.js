const breedsListResponse = {
    message: {
        boxer: [],
        cattledog: [],
        dalmatian: [],
        husky: [],
    },
};

const dogImagesResponse = {
    message: [
        "https://images.dog.ceo/breeds/cattledog-australian/IMG_1042.jpg ",
        "https://images.dog.ceo/breeds/cattledog-australian/IMG_5177.jpg",
    ],
};

/* an object that closely resembles the structure of what a fetch call would return in response to API calls within the application */
export default async function mockFetch(url) {
    switch (url) {
        /* the select dropdown that populates the list of breeds through an API call */
        case "https://dog.ceo/api/breeds/list/all": {
            return {
                ok: true,
                status: 200,
                json: async () => breedsListResponse,
            };
        }
        /* the API call to retrieve dog images when a search is performed */
        case "https://dog.ceo/api/breed/husky/images" :
        case "https://dog.ceo/api/breed/cattledog/images": {
            return {
                ok: true,
                status: 200,
                json: async () => dogImagesResponse,
            };
        }
        default: {
            throw new Error(`Unhandled request: ${url}`);
        }
    }
}