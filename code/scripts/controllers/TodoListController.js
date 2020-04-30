import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import ListModel from "./../models/ListModel.js";

export default class TodoListController extends ContainerController {
    constructor(element) {
        super(element);

        // List model
        this.listModel = new ListModel();

        // Set some default values for the view model
        this.model = this.setModel(this.listModel.toJSON());

        // Fetch data from EDFS and populate the view model
        this.listModel.hydrate(this.model);

        // Add new item to the list
        this.on('list:newItem', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._addNewListItem();
        })

        // Save the list to EDFS
        this.on('list:save', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this._saveList();
        })
    }

    _addNewListItem() {
        // Get the value from the "item" view model
        const newItem = this.model.item.value;

        // Appended to the "items" array
        this.model.items.push({
            item: newItem
        });

        // Clear the "item" view model
        this.model.item.value = '';
    }

    _saveList() {
        // Save data to EDFS
        this.listModel.save(this.model)
            .then((result) => {
                console.log('List was saved!')
            })
            .catch((err) => {
                console.log("An error occured");
                console.error(err);
            });
    }
}
