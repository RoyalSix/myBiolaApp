/**
 * @file Redux actions for the chapel container
 * {@link http://redux.js.org/docs/basics/Actions.html}
 */

import * as types from './actionTypes';
//Using constants instead of strings to differentiate types of actions
import { DOMParser } from 'react-native-html-parser';
//This is an external library used to parse html. React native does not 
//support this natively
import * as API from '../API'

/**
 * @description - This is a redux action that will initiate a chapel load.
 * This does two things for us:
 *  - This will allow us to have a field in the store that says chapels are loading
 *      if we ever wanted to show a loading screen.
 *  - This will allow us to fetch the chapels from an HTTP request (fetch) and send
 *      them back to the store asychoronously
 */
export function startDinigLoad() {
    return function (dispatch) {
        /*The dispatch fucntion allows us to call other redux actions
         * Also referred to the dispatcher 
         * This will allow us to also to perform asychoronous actions
         * {@link http://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators}
         */
        dispatch({
            type: types.START_DINING_LOAD,
            loadingDining: true
        })

        /**
         * This is the function that gets called to get the chapels, 
         * when the callback is called (once the chapels are received)
         * then recieveChapels will be called with that same data being passed
         * {@link https://medium.freecodecamp.com/javascript-callbacks-explained-using-minions-da272f4d9bcd}
         */
        return getDiningItems((content) => {
            //We have access to chapels here because of the callback
            dispatch(recieveDiningItems(content))
        })
    }
}

/**
 * @description - This function is a redux action that sends the chapels to the store
 * So that our components can use it as props
 * The type 'RECIEVE_CHAPEL_LOAD' specifies which reducer will recieve the action.
 * 
 * @param {object} chapels 
 */
export function recieveDiningItems(diningItems) {
    return {
        type: types.RECIEVE_DINING_LOAD,
        loadingDining: false,
        diningItems: diningItems
    }
}


/**
 * @description - This redux action gets the chapels from an html string and returns them
 * in a callback.
 * 
 * @param {function} callback 
 */
export function getDiningItems(callback) {
    cafeObjects = {};
    API.getJSONFromURL('legacy.cafebonappetit.com/weekly-menu/147727', function (htmlString) {
        var cafeArray = htmlString.body.div.div[1].div;
        cafeArray.forEach(function (element) {
            if (element.class == 'row ') {
                for (var i in element.div) {

                }
            }
        });
        callback(cafeObjects);
        //Calling the function in the @see startChapelLoad function which
        //allows us to return it to the dispatch
    });
}

/**
 * This function abstracts the parsing of the data we need
 * for the chapels from a list of nodes given
 * 
 * @param {Live Node List} nodeList 
 */
export function getArrayOfChapelsFromNodeList(nodeList) {
    var chapelList = [];
    for (var i = 0; i < nodeList.length; i++) {
        var chapelListItems = nodeList[i].querySelect('li');
        //For each item in the list of HTML nodes (which are basically the containers for 
        // the chapels) find the list items (li, which are the actual chapel nodes)
        for (var j = 0; j < chapelListItems.length; j++) {
            var chapelSplit = chapelListItems[j].childNodes;
            //For each chapel item we are spliting the different
            //elements it contains into an array
            var date = "";
            var title = "";
            var speaker = "";
            var location = "";
            //We need to initalize the variables here as an empty string
            //so that if they are undefined it will still be an empty string

            /**
             * The chapel array we are going to have here will have four items we care about
             * 1. The date of the chapel
             * 2. The title of the chapel
             * 3. The location of the chapel
             * 4. The speaker of the chapel
             * 
             * You have to search and find in the raw html
             * which element of the array you need and which query
             * call to recieve the right information
             * 
             * .textContent is the raw text of the inner html and is a good way to see what
             * the current node contains
             */
            try {
                title = chapelSplit[1].querySelect('.title')[0].textContent
                date = chapelSplit[0].textContent;
                location = chapelSplit[1].querySelect('.location')[0].textContent;
                speaker = chapelSplit[1].querySelect('.subtitle')[0].textContent;
            } catch (e) {
            }
            chapelList.push({
                date,
                title,
                speaker,
                location
            });
            //Adding it on to the array of chapels that will eventually be
            //passed back to the component List View
            // js/src/Containers/ChapelContainer
        }
    }
    return chapelList;
}