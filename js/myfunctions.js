(function()   // closure
{
    // represent a single to do item
    // contains a title, description and priority
    class Task
    {
        constructor(title, description, priority)
        {
            this.title = title;
            this.description = description;
            this.priority = priority;
        }
    }

    let taskList = []; // declare an array that holds all the to-do items

    // read the task that the user added and check if it is a valid input.
    const getTask = () =>
    {
        hideErrors();
        let t = document.getElementById("title").value;
        let d = document.getElementById("description").value;
        let p = document.getElementById("highPriority").checked;
        checkValidation(t.trim(), d.trim(), p);
    }
    // removes all the errors that were on the screen
    const hideErrors = () =>
    {
        document.getElementById("errorTitleEmpty").classList.add("d-none");
        document.getElementById("errorDescriptionEmpty").classList.add("d-none");
        document.getElementById("errorTitleExist").classList.add("d-none");
    }
    // check if the title and description input is valid by trimming the
    // white-spaces, tabs, etc, and checking if it is empty or already exist.
    function checkValidation(title, description, priority)
    {
        if (title.length > 0 && description.length > 0 && !checkTitleExist(title))
        {
            // the task is valid so we add it to out task list.
            let task = new Task(title, description, priority);
            addTask(task);
        }
        else // task is not valid, we show the right error message
        {
            if (title.length < 1)
                showErrorTitleEmpty();
            if (description.length < 1)
                showErrorDescriptionEmpty();
        }
    }
    // returns true if the title exist and false otherwise
    const checkTitleExist = (title) =>
    {
        for (let t of taskList)
            if (t.title === title)
            {
                //if title already exist show error message
                document.getElementById("errorTitleExist").classList.remove("d-none");
                return true;
            }
        return false;
    }
    // add a new task to the list and creates a new card to match it
    const addTask = (task) =>
    {
        taskList.push(task);
        createCard(task);
    }
    // shows an error if the title entered was empty
    const showErrorTitleEmpty = () =>
    {
        document.getElementById("errorTitleEmpty").classList.remove("d-none");
    }
    // shows an error if the description entered was empty
    const showErrorDescriptionEmpty = () =>
    {
        document.getElementById("errorDescriptionEmpty").classList.remove("d-none");
    }
    // this function receives a task and creates a matching card for it by creating
    // new elements on the HTML page
    const createCard = (task) =>
    {
        // creating a bold title for the card
        let title = document.createElement('h5');
        title.classList.add("card-title");

        let boldTitle = document.createElement('b');
        boldTitle.innerHTML = task.title;
        title.appendChild(boldTitle);

        // creating the text for the card with pre tag for preserving the actual input.
        let desc = document.createElement('pre');
        desc.innerHTML = task.description;
        desc.classList.add("card-text");

        // create a delete button for the card
        let btn = document.createElement("button");
        btn.innerHTML = "x"
        btn.classList.add("deleteBtn");

        let cardParent = document.createElement('div');
        cardParent.classList.add("card");
        let bodyParent = document.createElement('div');
        bodyParent.classList.add("card-body");

        // changing the high priority card to become more visible
        if (task.priority)
            cardParent.style.backgroundColor = "#ffcccb";

        bodyParent.appendChild(title);
        bodyParent.appendChild(desc);
        bodyParent.appendChild(btn);
        cardParent.appendChild(bodyParent);
        document.body.appendChild(cardParent); // add all elements to the HTML page

        // after all elements were added, we create a listener to the delete button
        btn.addEventListener('click', removeTask);
        btn.myParam = task.title;
    }
    // delete the task from the task list and it's matching card
    const removeTask = (event) =>
    {
        event.target.parentElement.parentElement.remove(); // remove the card
        removeTaskFromArray(event.currentTarget.myParam);
    }
    // delete the task from the task list
    const removeTaskFromArray = (title) =>
    {
        let i;
        for (i = 0; i < taskList.length; i++)
            if (taskList[i].title === title)
                break;

        taskList.splice(i, 1);
    }
    // deletes all the cards from the HTML page
    const deleteAllCards = () =>
    {
        let card = document.getElementsByClassName("card");
        while (card[0])
            card[0].parentNode.removeChild(card[0]);
    }

    // when the user press the show high priority button it shows only the
    // relevant cards on the page and if he press back button it return to the
    // previous page
    function switchVisibleContent(action)
    {
        let card = document.getElementsByClassName("card-title");
        switch(action)
        {
            // case 1 shows only the high priority cards without the user interface
            case 1:
                document.getElementById("userInterface").classList.add("d-none");
                document.getElementById("back").classList.remove("d-none");
                for (let c of card)
                    c.parentElement.parentElement.classList.add("d-none");

                for (let t = 0; t < taskList.length; t++)
                {
                    if (taskList[t].priority)
                        card[t].parentElement.parentElement.classList.remove("d-none");
                }
                break;

            // case 2 shows both the high priority cards and the user interface
            case 2:
                document.getElementById("userInterface").classList.remove("d-none");
                document.getElementById("back").classList.add("d-none");
                for (let t = 0; t < taskList.length; t++)
                    card[t].parentElement.parentElement.classList.remove("d-none");
                break;
        }
    }
    // the listeners to all the buttons are created when the DOM content loaded all the page.
    document.addEventListener('DOMContentLoaded', function ()
    {
        document.getElementById("addBtn").addEventListener('click', getTask)
        document.getElementById("sortBtn").addEventListener('click', function ()
        {
            taskList.sort(function (task1, task2)
            {
                return (task1.title < task2.title ? -1 : 1);
            })
            deleteAllCards();
            for (let t of taskList)
                createCard(t);
        })
        document.getElementById("showHighPriorityBtn").addEventListener('click', function()
        {
            switchVisibleContent(1);
        })
        document.getElementById("back").addEventListener('click',  function()
        {
            switchVisibleContent(2);
        })
    })
})();