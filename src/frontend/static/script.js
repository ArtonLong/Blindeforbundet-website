const courses = document.getElementById("courses");
const addedCourses = document.getElementById("added-courses")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const sentBtn = document.getElementById("send")
const rows = 3

ws = new WebSocket("");

ws.onmessage = function (event) {
    data = JSON.parse(event.data);
    courses_array = data.courses

    var row = document.createElement("div")
    row.className = "row"

    for (let index = 0; index < courses_array.length; index++) {
        const element = courses_array[index];

        if (index % rows == 0 && index != 0){
            courses.append(row)
            var row = document.createElement("div")
            row.className = "row"
        }

        var col = document.createElement("div");
        col.className = "col"
        var course = document.createElement("div");
        var name = document.createElement("p")
        var desc = document.createElement("p")
        var date = document.createElement("p")

        var btnDiv = document.createElement("div")
        btnDiv.className = "d-flex p-1 justify-content-end bg-dark"

        var addBtn = document.createElement("button")
        addBtn.className = "btn btn-warning add-button"
        addBtn.innerHTML = "Legg til"
        addBtn.type = "button"

        var removeBtn = document.createElement("button")
        removeBtn.style.display = "none"
        removeBtn.className = "btn btn-outline-warning remove-button"
        removeBtn.innerHTML = "Fjern"
        removeBtn.type = "button"
        btnDiv.append(addBtn, removeBtn)

        name.innerHTML = element.name
        desc.innerHTML = element.desc
        date.innerHTML = element.start_date + " - " + element.end_date

        course.className = "container p-5 bg-dark text-white border text-center"
        course.append(name, desc, date, btnDiv)
        col.append(course)
        row.append(col)
    }
    if (courses_array.length % rows != 0){
        courses.append(row)
    }
    
    const addBtns = document.querySelectorAll(".add-button")
    addBtns.forEach(button => {
        button.addEventListener("click", function (event) {
            var course = event.currentTarget.parentNode.parentNode
            var courseName = course.firstElementChild.innerHTML
            var addedCourse = course.cloneNode(true)
            addedCourse.childNodes[1].remove()
            addedCourse.lastElementChild.firstElementChild.remove()
            addedCourse.lastElementChild.lastElementChild.style.display = "block"

            course.lastElementChild.firstElementChild.id = courseName + "btn"
            course.lastElementChild.lastElementChild.id = courseName + "btn2"

            addedCourse.lastElementChild.lastElementChild.addEventListener("click", function (event2){
                var course = event2.currentTarget.parentNode.parentNode
                console.log(course.firstElementChild.innerHTML+"btn2")
                swapButton(document.getElementById(course.firstElementChild.innerHTML+"btn2"), document.getElementById(course.firstElementChild.innerHTML+"btn"))
                remove(event2)
            })
            addedCourse.id = courseName

            addedCourses.append(addedCourse)

            swapButton(event.currentTarget, event.currentTarget.parentNode.lastElementChild)
        })
    }); 

    const removeBtns = document.querySelectorAll(".remove-button")
    removeBtns.forEach(button => {
        button.addEventListener("click", function (event) {
            remove(event)
        })
    }); 
}

function remove(event) {
    var course = event.currentTarget.parentNode.parentNode
    var removeCourse = document.getElementById(course.firstElementChild.innerHTML)
    removeCourse.remove()
    swapButton(event.currentTarget, event.currentTarget.parentNode.firstElementChild)
}

function swapButton (button, button2) {
    button.style.display = "none"
    button2.style.display = "block"
}

sentBtn.addEventListener("click", function (event) {
    const nameValue = nameInput.value
    const emailValue = emailInput.value
    if (!nameValue.trim() || !emailValue.trim()){
        console.log("no name or email")
        return

    }
    if (addedCourses.childNodes.length === 0){
        console.log("no courses")
        return
    }
    var courses = []
    addedCourses.childNodes.forEach(course => {
        var d = {"course": course.firstChild.innerHTML}
        courses.push(d)
    });
    console.log("sendt")
    var data = {"name": nameValue, "email": emailValue, "courses": courses}
    ws.send(JSON.stringify(data))
})