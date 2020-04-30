export default class ListModel {

    constructor() {
        this.data = {
            items: [], // holds all the items of the list
            // view model for the "add new item" input
            item: {
                name: 'item',
                label: 'New item'
            }
        };
    }

    /**
     * Fetch data from EDFS and populate the view model
     */
    hydrate(model) {
        // We're getting the data through the Download
        // middleware of the Service Worker
        return fetch('/download/data/list.json')
            .then((response) => {
                if (!response.ok) {
                    return;
                }

                return response.json().then((data) => {
                    model.items = data.items;
                })
            })
            .catch((err) => {
                console.error(err);
            })

    }

    /**
     * Save the model to EDFS
     */
    save(data) {
        this.data.items = data.items;

        const listFile = new File([JSON.stringify(this.data)], 'list.json');

        // We're using the Upload middleware of the Service Worker
        // to upload data to EDFS.
        const saveEndpointUrl = `/upload?path=/data&filename=${listFile.name}`;

        return fetch(saveEndpointUrl, {
            method: 'POST',
            body: listFile
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    return Promise.reject("Unable to save list");
                }

                return Promise.resolve();
            })
        })
    }

    getJsonResponseBody(response) {
        return response.json((result) => {
            return result;
        }).catch((err) => {
            return Promise.resolve({});
        })
    };

    /**
     * Return a copy of the data
     */
    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}
