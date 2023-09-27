const radioButtons = document.querySelectorAll('input[type="radio"]');
let btnLancement = document.getElementById("btnLancement");
let score = 0;

//-- Choix des boutons niveaux pour pouvoir commencer le quizz --//
for (i = 0; i < radioButtons.length; i++) {
  
  let buttonId = i;
  radioButtons[i].addEventListener("change", () => {
    if (radioButtons[buttonId].checked) {
      let prenom = prompt("Veuillez saisir votre prénom :");
      //-- Si le nom est différent de 0 on lance l'appel ajax des fichiers JSON --//
      if (prenom !== null) {

        //-- cela fait appel aux ID de chaques questionnaires qu'on a mis en place dès le début de la div-- //
        fetch("./" + radioButtons[buttonId].parentElement.parentElement.id + ".json")
          .then((response) => response.json())
          .then((response) => {
            console.log(radioButtons[buttonId].parentElement.parentElement.id);

            //-- Ouverture de la première page HTML dynamique avec la présentation de la rubrique + le niveau choisi --//
            let body = document.getElementById("body");
            body.innerHTML =
              '<h2 class="text-center text-light mt-5 fs-1">Quizz World</h2><br/><br/>' +
              '<div class="text-center fs-2 text-light">' + response.thème + " niveau " +
              radioButtons[buttonId].value +
              "</div>" +
              '<div class="fs-2 text-light text-center">' + prenom + ", " + "Vous allez pouvoir démarrer ce quizz!" +
              '</div><br/>' +
              '<div class="d-flex justify-content-center"><img class="container rounded-5" src="img/' + radioButtons[buttonId].parentElement.parentElement.id + '.jpg">' + 
              '</div><br/><br/>' +
              '<button id="btnLancement" class="container d-flex justify-content-center w-25 text-light" type="submit">démarrer le quizz</button>';

            btnLancement = document.getElementById("btnLancement");
            btnLancement.addEventListener("click", function () {
              //-------------Choisir mes 3 niveaux de =difficultés------------//
              let niveauSelectionne = "";
              niveauSelectionne = radioButtons[buttonId].value;
              console.log(niveauSelectionne);
              console.log(response.quizz[niveauSelectionne]);
              questionnaireTotal(); // --Appel à la fonction questionnaireTotal-- //
            });

            // --Fonction pour afficher les questions du quizz-- //
            function questionnaireTotal() {
              let i = 0;

              // --Affiche la première question --//
              afficherQuestion(i);

              function afficherQuestion(index) {
                let niveauSelectionne = "";
                niveauSelectionne = radioButtons[buttonId].value;
                if (index < response.quizz[niveauSelectionne].length) {
                  let quizzNiveauSelect = response.quizz[niveauSelectionne][index];
                  anecdote = quizzNiveauSelect.anecdote;
                  
                  // -- Affichage de toutes les questions sous forme html en dynamique-- //
                  body.innerHTML =
                    '<h2 class="text-center text-light mt-5 fs-1">Quizz World</h2><br/><br/>' +
                    '<div class="text-center fs-2 text-light">' + response.thème + " niveau " + radioButtons[buttonId].value +
                    "</div><br/>" +
                    '<div class="text-center fs-3 text-light">' + quizzNiveauSelect.question +
                    "</div><br/><br/>" +
                    '<div class="container text-center text-light" id="anecdote"></div>' +
                    '<div class="container-fluid">' +
                    '<div id="propositionJeu" class=" d-flex flex-wrap sm-4 lg-3 justify-content-around mx-2">' +
                    '<div class="response border border-4 text-center mt-5 rounded-5 mx-2 p-2 proposition">' + quizzNiveauSelect.propositions[0] +
                    "</div>" +
                    '<div class="response border border-4 text-center mt-5 rounded-5 mx-2 p-2 proposition">' + quizzNiveauSelect.propositions[1] +
                    "</div>" +
                    '<div class="response border border-4 text-center mt-5 rounded-5 mx-2 p-2 proposition">' + quizzNiveauSelect.propositions[2] +
                    "</div>" +
                    '<div class="response border border-4 text-center mt-5 rounded-5 mx-2 p-2 proposition">' + quizzNiveauSelect.propositions[3] +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    '<div class="container d-flex align-items-center justify-content-center mt-5">' +
                    '<div id="borderChoix" class="mt-5 rounded w-25 text-center p-5 ">Posez votre choix dans le case</div>' +
                    '<button id="btnSuivant" class="mt-5 m-5" type="submit">Suivant</button>' +
                    "</div>";

                  // -- Rendre invisible le bouton suivant pour le moment-- //  
                  let btnSuivant = document.getElementById("btnSuivant");
                  btnSuivant.style.visibility = "hidden";

                  $(document).ready(function () {
                    // --Rendre les divs .proposition glissables-- //
                    // -- Utilisation du framework jquery-ui--//
                    $(".proposition").draggable({
                    // --Ramener la div à sa position d'origine si elle n'est pas déposée correctement-- //
                      revert: "invalid", 
                    });

                    $("#borderChoix").droppable({
                      accept: ".proposition",
                      drop: function (event, ui) {
                        // --Insérez votre logique de gestion du dépôt ici-- //
                        const reponse = quizzNiveauSelect.réponse;
                        // --Obtenir le texte de la proposition glissée-- //
                        const proposition = $(ui.draggable).text(); 

                        // --Vérifier si la réponse correspond à la proposition glissée-- //
                        // -- Rendre visible le btn suivant pour passer à la question suivante--//
                        if (reponse === proposition) {
                          btnSuivant.style.visibility = "visible";
                          let anecdote = document.getElementById("anecdote");
                          anecdote.innerHTML = quizzNiveauSelect.anecdote;
                          $("#borderChoix").css("background-color", "green");
                          score++
                        } else {
                          btnSuivant.style.visibility = "visible";
                          $("#borderChoix").css("background-color", "red");
                          console.log(reponse);
                          $(".proposition").each(function () {
                            if ($(this).text() === reponse) {
                              $(this).css("background-color", "green");
                            }
                          });
                        }
                      },
                    });

                    btnSuivant.addEventListener("click", function () {
                      // --On passe à la question suivante-- //
                      i++;
                      //  --On affiche la prochaine question-- //
                      afficherQuestion(i); 
                    });
                  });
                } else {
                  // -- Si fin de toutes les questions, message HTML pour donner les score et le bouton de reload-- //
                  body.innerHTML =

                  '<h2 class="text-center text-light mt-5 fs-1">Quizz World</h2><br/><br/>' +
                  '<div class="text-center fs-2 text-light">' +
                  response.thème + " niveau " + radioButtons[buttonId].value +
                  '</div>' +
                  '<div class="fs-2 text-light text-center">' +
                    prenom + ' Vous avez obtenu le score de ' + score + '/10' +
                  '</div>' + 
                  '<button id="accueil"class="d-flex mt-5  mx-auto">Accueil</button>'  
                  // -- Rafraichissement de la page-- //
                  let accueil = document.getElementById("accueil");
                  accueil.addEventListener('click', function (){
                    window.location.reload();
                  })
                }
              }
            }
            
          })
          //-- Pour les erreurs AJAX-- //
          .catch(error => {
            console.log('Erreur dans votre requête AJAX');
          });
      }
    }
  });
}
