const searchInput = document.getElementById("searchTeacher");
const teacherCards = document.querySelectorAll(".teacher-card");

searchInput.addEventListener("input", function () {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    teacherCards.forEach(function (card) {

        const cardText = card.textContent
            .toLowerCase();

        if (cardText.includes(searchText)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});
