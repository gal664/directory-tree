document.addEventListener("DOMContentLoaded", function () {

      const pathInput = document.getElementById("pathInput")
      const dirNameInput = document.getElementById("dirNameInput")
      const submitBtn = document.getElementById("submitBtn")
      const initialContainer = document.getElementsByClassName("initial_container")[0]
      const treeContainer = document.getElementsByClassName("tree_container")[0]
      const responseElement = document.getElementById("responseData")
      const searchbarInput = document.getElementById("searchbar")
      const searchResultsContainer = document.getElementById("searchResults")
      let fallingEmojis
      submitBtn.addEventListener("click", () => {

            let emojisContainer = document.querySelector("#emojisContainer")
            fallingEmojis = setInterval(() => createFallingEmoji(emojisContainer), 50);
            
            initialContainer.style.display = "none"
            console.log(fallingEmojis)
            let path = `${pathInput.value}/${dirNameInput.value}`

            fetch(`/dirtree?path=${path}`, { method: "get" })
                  .then(res => res.json())
                  .then(data => {

                        clearInterval(fallingEmojis)
                        treeContainer.style.display = "flex"

                        let hierarchy = createHierarchyDiv(data)
                        responseElement.appendChild(hierarchy)

                        searchbarInput.addEventListener("change", (event) => {

                              while (searchResultsContainer.children[0]) {
                                    searchResultsContainer.removeChild(searchResultsContainer.children[0]);
                              }

                              if (searchbarInput.value.length > 2) {

                                    let query = searchbarInput.value
                                    let results = search(data.children, query)

                                    for (result of results) {
                                          let liElement = createHierarchyDiv(result)
                                          searchResultsContainer.appendChild(liElement)
                                    }

                              }

                        })

                  })

      })

})

function createFallingEmoji(container) {
      
      let emojis = ["👻", "🤑", "👹", "😻", "💅", "🐔", "🌟", "🍑", "🌈", "🦔", "🍄", "🥨", "🍤", "🍩", "🍰", "🍕", "🍹", "✈️", "🏠", "🔮", "🛌", "🎁", "🎈"]

      let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      
      let fallingDiv = document.createElement("div")
      fallingDiv.className = "falling"
      fallingDiv.style.right = `${Math.floor(Math.random() * 95) + 1}%`
      
      let spinningDiv = document.createElement("div")
      spinningDiv.className = "spinning"
      spinningDiv.innerText = randomEmoji
      
      fallingDiv.appendChild(spinningDiv);
      container.appendChild(fallingDiv)
      setTimeout(() => container.removeChild(fallingDiv), 3000);
}

function search(data, query) {

      let results = []

      for (let i = 0; i < data.length; i++) {

            let team = data[i]

            if (team.name.indexOf(query) > -1) {

                  results.push(team)

            }

            if (team.type == "directory") {

                  for (let j = 0; j < team.children.length; j++) {

                        let member = team.children[j]

                        if (member.name.indexOf(query) > -1) {

                              results.push(member)

                        }

                        if (member.type == "directory") {

                              for (let x = 0; x < member.children.length; x++) {

                                    let school = member.children[x]

                                    if (school.name.indexOf(query) > -1) {

                                          results.push(school)

                                    }

                              }

                        }

                  }

            }

      }

      return results

}

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

      if (lastFolderNames.indexOf(obj.name) == -1) {
            listItem.innerText = obj.name
      } else {
            if (obj.children.length == 0) {
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