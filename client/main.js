document.addEventListener("DOMContentLoaded", function () {

      const pathInput = document.getElementById("pathInput")
      const dirNameInput = document.getElementById("dirNameInput")
      const submitBtn = document.getElementById("submitBtn")
      const initialContainer = document.getElementsByClassName("initial_container")[0]
      const treeContainer = document.getElementsByClassName("tree_container")[0]
      const responseElement = document.getElementById("responseData")

      submitBtn.addEventListener("click", () => {

            let path = `${pathInput.value}/${dirNameInput.value}`

            fetch(`/dirtree?path=${path}`, { method: "get" })
                  .then(res => res.json())
                  .then(data => {
                        initialContainer.style.display = "none"
                        treeContainer.style.display = "flex"

                        let hierarchy = createHierarchyDiv(data)
                        responseElement.appendChild(hierarchy)

                  })

      })

})

function createHierarchyDiv(obj) {
      let container = document.createElement("ul")
      container.classList.add("hierarchy_container")

      let listItem = document.createElement("li")
      listItem.classList.add("hierarchy_li")
      
      let lastFolderNames = [
            "בניית תוכנית עבודה",
            "מבחני אמצע שנה ודוחות נלווים",
            "מבחני סוף שנה ודוחות נלווים",
            "מבחני פתיחת שנה ודוחות נלווים",
            "סטטוס אמצע שנה מנהל בית ספר",
            "פתיחת שנת הלימודים",
      ]
      
      if(lastFolderNames.indexOf(obj.name) == -1){
            listItem.innerText = obj.name
      } else {
            if(obj.children.length == 0){
                  listItem.innerText = `${obj.name} (${obj.children.length}) 😠`
                  listItem.classList.add("hierarchy_li_bad")
            } else {
                  listItem.innerText = `${obj.name} (${obj.children.length}) 😍`
                  listItem.classList.add("hierarchy_li_good")
            }
      }
      
      
      
      listItem.setAttribute("state", "closed")

      listItem.addEventListener("click", () => {
            let listItemState = listItem.getAttribute("state")

            switch (listItemState) {

                  case "closed":

                        listItem.setAttribute("state", "open")

                        if (obj.type == "directory") {

                              for (child of obj.children) {
                                    let childObj = createHierarchyDiv(child)
                                    container.appendChild(childObj)
                              }

                        }

                        break;

                  case "open":

                        listItem.setAttribute("state", "closed")

                        if (obj.type == "directory") {

                              while (container.children[1]) {
                                    container.removeChild(container.children[1]);
                              }

                        }

                        break;
            }

      }, false)

      container.appendChild(listItem)

      return container
}