class Pion {
    constructor(image, type, x, y, orientation) {
        this.image = image;  
        this.type = type;    
        this.x = x;          
        this.y = y; 
        this.element = null;
        this.plateau = null; 
        this.orientation = orientation
    }

    createPieceElement() {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('piece');
        pieceElement.style.backgroundImage = `url(${this.image})`;
        pieceElement.style.position = 'absolute';
        pieceElement.style.left = `${this.x}%`;
        pieceElement.style.top = `${this.y}%`;
        pieceElement.style.width = '6%';
        pieceElement.style.height = '12%';
        pieceElement.style.backgroundSize = 'contain';
        pieceElement.style.backgroundRepeat = 'no-repeat';
        pieceElement.style.backgroundPosition = 'center';

        pieceElement.addEventListener('click', () => {
            this.plateau.reinitialiserCases()
            this.selectPiece();

        });

        this.element = pieceElement;
        return pieceElement;
    }

    selectPiece() {
        if (this.plateau.fin_de_jeu === false){
        if (this.type === this.plateau.tour_animal) {  
            if (this.plateau.PionChoisi !== this) {
                if (this.plateau.PionChoisi) {
                    this.plateau.PionChoisi.deselectPiece();
                }
    
                this.element.style.border = '3px solid rgba(70, 130, 180, 0.9)'; 
                this.element.style.boxShadow = '0 0 15px rgba(70, 130, 180, 0.7)'; 
                this.element.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'; 
                
                
    
                this.plateau.PionChoisi = this; 
                this.plateau.jouerPion(this);
            } else {
                this.deselectPiece();
            }
        }
    }
}

    deselectPiece() {
        this.element.style.border = ''; 
        this.element.style.boxShadow = ''; 
        this.element.style.transition = ''; 
        this.plateau.PionChoisi = null;
        this.plateau.boutons.activerBoutons(false, this); 
    }
    

    tournerImage(angle) {
        if (this.element) {
            this.element.style.transform = `rotate(${angle}deg)`; 
        }   
    }
    bouger(nouvelleX, nouvelleY, forcee=false) {
        for (let elt of this.plateau.pieces){
            if(nouvelleX == elt.x && nouvelleY == elt.y && elt.y != 80 && elt.y != 8){
                return;
            }
        }
        if (nouvelleX < 35 || nouvelleX > 59) {
            if (this.type == 'rocher'){
                if (nouvelleX < 35){
                    this.x = 35 - 6;
                    this.element.style.left = `${this.x}%`;
                    this.element.style.top = `${this.y}%`;
                    this.plateau.gerer_victoire(41, this.y, 270);
                }
                if (nouvelleX > 59){
                    this.x = 59 + 6;
                    this.element.style.left = `${this.x}%`;
                    this.element.style.top = `${this.y}%`;
                    this.plateau.gerer_victoire(53, this.y, 90);
                }
            }
            else{
                this.plateau.retournerDansMainSansFinTour(this);
                this.deselectPiece(this);
                if (!forcee) {
                    this.plateau.finTour();
                }
            }
        }
        else if (nouvelleY < 20 || nouvelleY > 68) {
            if(this.type == 'rocher'){
                if (nouvelleY < 20){
                    this.y = 20 - 12;
                    this.element.style.left = `${this.x}%`;
                    this.element.style.top = `${this.y}%`;
                    this.plateau.gerer_victoire(this.x, 32, 0);
                }
                if (nouvelleY > 68){
                    this.y = 68 + 12;
                    this.element.style.left = `${this.x}%`;
                    this.element.style.top = `${this.y}%`;
                    this.plateau.gerer_victoire(this.x, 56, 180);
                }
            }
            else{
                this.plateau.retournerDansMainSansFinTour(this);
                this.deselectPiece(this);
                if (!forcee){
                    this.plateau.finTour();
                }
            }
        }
        else {
            this.x = nouvelleX;
            this.y = nouvelleY;
            this.element.style.left = `${this.x}%`;
            this.element.style.top = `${this.y}%`;
            if (!forcee) {
                this.plateau.a_bouge = true;
                this.plateau.pion_bouge = this;
                this.plateau.PionChoisi = this;
                this.plateau.boutons.activerBoutons(true, this);
            }
        }
    }

    replacer(nouvelleX, nouvelleY){
        this.x = nouvelleX;
        this.y = nouvelleY;
        this.element.style.left = `${this.x}%`;
        this.element.style.top = `${this.y}%`;
        this.plateau.a_bouge = true;
        this.plateau.pion_bouge = this;
        this.plateau.PionChoisi = this;
        this.plateau.boutons.activerBoutons(true, this);
    }

    
    tournerPion(direction) {
        const angles = {
            haut: 0,
            droite: 90,
            bas: 180,
            gauche: 270,
        };

        if (angles[direction] !== undefined) {
            this.orientation = angles[direction];
            this.element.style.transform = `rotate(${this.orientation}deg)`;
        } else {
            console.error("Direction inconnue pour tourner la pièce.");
        }
    }
}
class Boutons {
    constructor(plateau) {
        this.plateau = plateau; 
        this.buttonsContainer = document.getElementById('rotate-buttons');
        this.buttons = this.initButtons(); 
    }

    initButtons() {
        const buttons = {};
        const directions = ['haut', 'gauche', 'droite', 'bas'];
    
        directions.forEach((direction) => {
            const button = this.buttonsContainer.querySelector(`button[data-direction="${direction}"]`);
            button.addEventListener('click', () => this.onButtonClick(direction));
            buttons[direction] = button;
        });
    
        const endTurnButton = document.getElementById("end-turn-button");
        endTurnButton.addEventListener("click", () => this.plateau.finTour());
        const resetButton = document.getElementById("reset-game-button");
        resetButton.addEventListener("click", () => this.plateau.resetGame()); 
        return buttons;
    }
    
    onButtonClick(direction) {
        const pionChoisi = this.plateau.PionChoisi;
    
        if (!pionChoisi) {
            console.error("Aucune pièce sélectionnée.");
            return;
        }
    
        if (this.plateau.a_bouge && pionChoisi !== this.plateau.pion_bouge) {
            return;
        }
    
        pionChoisi.tournerPion(direction);
        this.plateau.finTour();
    }
    
    activerBoutons(activer, pion) {
        let direction = "";
    
        if (!pion) {
            Object.values(this.buttons).forEach((button) => (button.disabled = true));
            document.getElementById("end-turn-button").disabled = true; 
            return;
        }
    
        if (pion.y === 8 || pion.y === 80) {
            Object.values(this.buttons).forEach((button) => (button.disabled = true));
            document.getElementById("end-turn-button").disabled = true; 
            return;
        }
    
        if (activer) {
            switch (pion.orientation) {
                case 0:
                    direction = "haut";
                    break;
                case 90:
                    direction = "droite";
                    break;
                case 180:
                    direction = "bas";
                    break;
                case 270:
                    direction = "gauche";
                    break;
                default:
                    console.error("Orientation inconnue:", pion.orientation);
                    direction = null;
            }
        }
    
        Object.entries(this.buttons).forEach(([dir, button]) => {
            button.disabled = !activer || dir === direction;
        });
    
        document.getElementById("end-turn-button").disabled = !this.plateau.a_bouge;
    
    }
    
  
}
    

class Plateau {
    constructor(element) {
        this.element = element;  
        this.pieces = [];
        this.PionChoisi = null;
        this.tour_animal = "éléphant";
        this.compteur_tour = 1;
        this.a_bouge = false;
        this.pion_bouge = null;
        this.fin_de_jeu = false

        
        this.boutons = new Boutons(this);
        this.boutons.activerBoutons(false, this.PionChoisi);

        this.cases = [
            [{ x: 35, y: 8 }, { x: 41, y: 8 }, { x: 47, y: 8 }, { x: 53, y: 8 }, { x: 59, y: 8 }],
 
            [{ x: 35, y: 20 }, { x: 41, y: 20 }, { x: 47, y: 20 }, { x: 53, y: 20 }, { x: 59, y: 20 }],
    
            [{ x: 35, y: 32 }, { x: 41, y: 32 }, { x: 47, y: 32 }, { x: 53, y: 32 }, { x: 59, y: 32 }],
        
            [{ x: 35, y: 44 }, { x: 41, y: 44 }, { x: 47, y: 44 }, { x: 53, y: 44 }, { x: 59, y: 44 }],
        
            [{ x: 35, y: 56 }, { x: 41, y: 56 }, { x: 47, y: 56 }, { x: 53, y: 56 }, { x: 59, y: 56 }],
   
            [{ x: 35, y: 68 }, { x: 41, y: 68 }, { x: 47, y: 68 }, { x: 53, y: 68 }, { x: 59, y: 68 }],

            [{ x: 35, y: 80 }, { x: 41, y: 80 }, { x: 47, y: 80 }, { x: 53, y: 80 }, { x: 59, y: 80 }]
           ];
    }
    initialiser_pieces() {
        for (let i = 0; i < 5; i++) {
            const pion = new Pion(`./Images/Elephant${i + 1}.png`, 'éléphant', this.cases[0][i].x, this.cases[0][i].y, 180);
            this.ajouterPiece(pion);
            pion.tournerPion("bas"); 
        }
    
        for (let i = 0; i < 5; i++) {
            const pion = new Pion(`./Images/Rhino${i + 1}.png`, 'rhino', this.cases[6][i].x, this.cases[6][i].y, 0);
            this.ajouterPiece(pion);
        }
        for (let i = 1; i <= 3; i++) { 
            const imagerocher = Math.floor(Math.random() * 5) + 1; 
            const angleAleatoire = Math.floor(Math.random() * 4) * 90; 
            const rocher = new Pion(`./Images/Rocher${imagerocher}.png`, 'rocher', this.cases[3][i].x, this.cases[3][i].y);
            this.ajouterPiece(rocher);
            rocher.tournerImage(angleAleatoire); 
        
        }
        this.highlightActivePieces();
    }
    gerer_victoire(valx, valy, orientation){
        let trouve = false;
        for(let elt of this.pieces){
            if(elt.x == valx && elt.y == valy && elt.orientation == orientation){
                if(elt.type == 'éléphant'){
                    trouve = true;
                    window.alert("Victoire des éléphants !");
                }
                if(elt.type == 'rhino'){
                    trouve = true;
                    window.alert("Victoire des rhinocéros !")
                }
            }
        }
        if (!trouve){
            if(orientation == 0){
                this.gerer_victoire(valx, valy + 12, orientation);
            }
            if(orientation == 90){
                this.gerer_victoire(valx - 6, valy, orientation);
            }
            if(orientation == 180){
                this.gerer_victoire(valx, valy - 12, orientation);
            }
            if(orientation == 270){
                this.gerer_victoire(valx + 6, valy, orientation);
            }
        }
        this.fin_de_jeu = true
        if (this.PionChoisi != null){
            this.PionChoisi.deselectPiece();
        }
        document.getElementById("rotate-buttons").disabled = true; 
        document.getElementById("end-turn-button").disabled = true;
        return;
    }
    mettreAJourAffichageTour() {
        const tourImage = document.getElementById('tour-image');
        
        if (this.tour_animal === "éléphant") {
            tourImage.src = "./Images/Elephant1.png";
        } else {
            tourImage.src = "./Images/Rhino1.png"; 
        }
    }

    highlightActivePieces() {
        this.pieces.forEach(piece => {
            piece.element.classList.remove('highlight-active'); 
        });
    
        this.pieces
            .filter(piece => piece.type === this.tour_animal) 
            .forEach(piece => {
                piece.element.classList.add('highlight-active'); 
            });
    }
    
    ajouterPiece(pion) {
        this.pieces.push(pion);
        pion.plateau = this;  
        this.element.appendChild(pion.createPieceElement());  
    }

    deplacerPion(pion, ligne, colonne) {
        const coord = this.cases[ligne][colonne];
        pion.bouger(coord.x, coord.y); 
    }
    afficherCase(x, y, couleur, pion, poussee_main=false) {
        const indicateur = document.createElement('div');
        indicateur.classList.add('indicateur');
        indicateur.style.position = 'absolute';
        indicateur.style.left = `${x}%`;
        indicateur.style.top = `${y}%`;
        indicateur.style.width = '6%';
        indicateur.style.height = '12%';
        indicateur.style.backgroundColor = couleur;
        indicateur.style.opacity = '0.5';
    
        let dx = 0, dy = 0;
        let bonne_direction = true;
    
        switch (pion.orientation) {
            case 0: dy = -12; break; 
            case 180: dy = 12; break; 
            case 90: dx = 6; break; 
            case 270: dx = -6; break; 
        }

        if (couleur === 'red') {
            switch (pion.orientation) {
                case 0: if (y >= pion.y) bonne_direction = false; break; 
                case 180: if (y <= pion.y) bonne_direction = false; break; 
                case 90: if (x <= pion.x) bonne_direction = false; break; 
                case 270: if (x >= pion.x) bonne_direction = false; break; 
            }

    
        }
    
        indicateur.addEventListener('click', () => {
            let lerocher = false;
            let pasrocher = false;
            if (this.estCaseOccupee(x, y)) {
                let currentX = x;
                let currentY = y;
    
                let dx = 0, dy = 0;
                switch (pion.orientation) {
                    case 0: dy = -12; break; 
                    case 180: dy = 12; break; 
                    case 90: dx = 6; break; 
                    case 270: dx = -6; break; 
                }

                if(!this.calculer_forces(pion, dx, dy)){
                return ;
                }

                const pionsAPousser = [];
                while (this.estCaseOccupee(currentX, currentY)) {
                    const piece = this.pieces.find(p => p.x === currentX && p.y === currentY);
                    if (!piece) break; 
                    pionsAPousser.push(piece);
                    currentX += dx;
                    currentY += dy;
                }
    
                if (!this.estCaseOccupee(currentX, currentY)) {
                    for (let i = pionsAPousser.length - 1; i >= 0; i--) {
                        const piece = pionsAPousser[i];
                        if (currentY == 8 || currentY == 80 || currentX < 35 || currentX > 59){
                            if(piece.type == 'rocher'){
                                lerocher = true;
                                piece.bouger(currentX, currentY);
                            }
                            else if((piece.type == 'éléphant' || piece.type == 'rhino') && !pasrocher){
                                pasrocher = true;
                                piece.bouger(piece.x + dx, piece.y + dy, true);
                            }
                            else if(lerocher || pasrocher){
                                console.log("Ici");
                                piece.bouger(piece.x + dx, piece.y + dy, true);
                            }
                            else{
                                this.retournerDansMainSansFinTour(piece);
                            }
                        }
                        else{
                            piece.bouger(piece.x + dx, piece.y + dy, true);
                        }

                    }
                    pion.bouger(x, y);
                    this.finTour();  

                } 
            } else {
                if (y == 8 || y == 80 || x < 35 || x > 59){
                    this.retournerDansMainSansFinTour(pion);
                    this.finTour();
                }
                else{
                    pion.bouger(x, y);
                }
            }
    
            this.reinitialiserCases(); 

        });
    
        if (bonne_direction) {
            this.element.appendChild(indicateur);
        }
    }
    
    calculer_forces(pion, dx, dy) {
        if(this.a_bouge){
            return;
        }
        let courant_x = pion.x + dx;
        let courant_y = pion.y + dy;
        let force_actuelle = 1;
        let compteur_rocher = 0;
    
        while (this.estCaseOccupee(courant_x, courant_y)) {
            const pion_courant = this.pieces.find(p => p.x === courant_x && p.y === courant_y);
            if (!pion_courant) break;
            if(pion_courant.y == 80 || pion_courant.y == 8) return true;
            if (pion_courant.type === 'rocher') {
                compteur_rocher += 1
                if (force_actuelle < compteur_rocher){
                    return false
                }
            } else if (pion_courant.orientation === pion.orientation) {
                force_actuelle += 1; 
            } else if (this.opposition(pion.orientation, pion_courant.orientation)) {
                force_actuelle -= 1; 
            }
    
            if (force_actuelle <= 0) {
                return false;
            }
    
            courant_x += dx;
            courant_y += dy;
        }
    
        return true;
    }
    

    opposition(orientation1, orientation2) {
        return (orientation1 === 0 && orientation2 === 180) ||
               (orientation1 === 180 && orientation2 === 0) ||
               (orientation1 === 90 && orientation2 === 270) ||
               (orientation1 === 270 && orientation2 === 90);
    }
    reinitialiserCases() {
        const indicateurs = document.querySelectorAll('.indicateur');
        indicateurs.forEach(indicateur => indicateur.remove()); 
         
    }



    estCaseOccupee(x, y) {
        for (const piece of this.pieces) {
            if (piece.x === x && piece.y === y) {
                if (piece.y == 80 || piece.y == 8){
                    return false;
                }
                return true;  
            }
        }
        return false;  
    }
    estCaseOccupeeBase(x, y) {
        for (const piece of this.pieces) {
            if (piece.x === x && piece.y === y) {
                return true;  
            }
        }
        return false;  
    }
    retournerDansMainSansFinTour(pion){
        let ligne; 
        if (pion.type === 'éléphant') {
            ligne = this.cases[0];
            pion.orientation = 180; 
            pion.tournerPion("bas");
        } else if (pion.type === 'rhino') {
            ligne = this.cases[6]; 
            pion.orientation = 0; 
            pion.tournerPion("haut");
        }
    
        for (const coord of ligne) {
            if (!this.estCaseOccupeeBase(coord.x, coord.y)) {
                pion.replacer(coord.x, coord.y);
            }
    }
    }

    finTour() {
        this.compteur_tour++;
        this.tour_animal = this.tour_animal === "éléphant" ? "rhino" : "éléphant"; 
        this.a_bouge = false;      
        const pionAdversaire = this.pion_bouge; 
    
        this.pion_bouge = null;     
        this.reinitialiserCases();  
        this.deselectionnerToutesLesPieces(); 
        this.mettreAJourAffichageTour(); 
        this.boutons.activerBoutons(false, null); 
        document.getElementById("end-turn-button").disabled = true; 
    
        this.highlightAdversaryMove(pionAdversaire);
        this.highlightActivePieces();
    }
    
    
    highlightAdversaryMove(pion) {
        this.pieces.forEach(piece => {
            piece.element.classList.remove("highlight-adversary");
        });
    
        if (pion) {
            pion.element.classList.add("highlight-adversary");
        }
    }
    deselectionnerToutesLesPieces() {
        this.pieces.forEach(piece => {
            piece.element.style.border = ''; 
        });
        this.PionChoisi = null; 
    }
    
    
    jouerPion(pion) {
        if (this.a_bouge && pion !== this.pion_bouge) {
            return;
        }

        let cases_possibles = [];
        let cases_poussables = [];
        let mouvement_depuis_main = false;
        if (this.tour_animal === pion.type) {
            if (this.compteur_tour < 5) {
                if (pion.y === 8 || pion.y === 80) {
                    cases_possibles = [
                        this.cases[1][0], this.cases[1][1], this.cases[1][3], this.cases[1][4],
                        this.cases[2][0], this.cases[2][4], this.cases[3][0], this.cases[3][4],
                        this.cases[4][0], this.cases[4][4],
                        this.cases[5][0], this.cases[5][1], this.cases[5][3], this.cases[5][4]
                    ];
                    cases_poussables = cases_possibles.filter(coord => this.estCaseOccupee(coord.x, coord.y));
                    mouvement_depuis_main = true;
                    cases_possibles = cases_possibles.filter(coord => !this.estCaseOccupee(coord.x, coord.y));
                } else {
                    const directions = [
                        { x: pion.x - 6, y: pion.y }, 
                        { x: pion.x + 6, y: pion.y }, 
                        { x: pion.x, y: pion.y - 12 }, 
                        { x: pion.x, y: pion.y + 12 } 
                    ];
                
                    directions.forEach(coord => {
                        if (!this.estCaseOccupee(coord.x, coord.y) || coord.y == 80 || coord.y == 8) {
                            cases_possibles.push(coord);
                        }
                    });
                }
            } else {
                if (pion.y === 8 || pion.y === 80) {
                    cases_possibles = [
                        this.cases[1][0], this.cases[1][1], this.cases[1][3], this.cases[1][4],
                        this.cases[2][0], this.cases[2][4], this.cases[3][0], this.cases[3][4],
                        this.cases[4][0], this.cases[4][4],
                        this.cases[1][2], this.cases[5][2],
                        this.cases[5][0], this.cases[5][1], this.cases[5][3], this.cases[5][4]
                    ];
                    cases_poussables = cases_possibles.filter(coord => this.estCaseOccupee(coord.x, coord.y));
                    mouvement_depuis_main = true;
                    cases_possibles = cases_possibles.filter(coord => !this.estCaseOccupee(coord.x, coord.y));
                } else {
                    const directions = [
                        { x: pion.x - 6, y: pion.y }, 
                        { x: pion.x + 6, y: pion.y }, 
                        { x: pion.x, y: pion.y - 12 }, 
                        { x: pion.x, y: pion.y + 12 } 
                    ];
                    directions.forEach(coord => {
                        if (!this.estCaseOccupee(coord.x, coord.y) || coord.y == 80 || coord.y == 8) {
                            cases_possibles.push(coord);
                        }
                    });
                }
            }
            const directions = [
                { x: pion.x - 6, y: pion.y }, 
                { x: pion.x + 6, y: pion.y }, 
                { x: pion.x, y: pion.y - 12 }, 
                { x: pion.x, y: pion.y + 12 } 
            ];
            directions.forEach(coord => {
                if (this.estCaseOccupee(coord.x, coord.y)) {
                    if (
                        !(coord.y === 8) && 
                        !(coord.y === 80) 
                    ) {
                        cases_poussables.push(coord);
                    }
                }
            });
            if (this.a_bouge === true){
                cases_possibles = [];
            }
            for (const coord of cases_possibles) {
                this.afficherCase(coord.x, coord.y, 'blue', pion);
            }
            if(!mouvement_depuis_main){
            for (const coord of cases_poussables) {
                this.afficherCase(coord.x, coord.y, 'red', pion);
            }
        }
        else{
            for(const coord of cases_poussables){
                this.afficher_cases_mouvement_main(coord.x, coord.y, 'red', pion);
            }
        }
        this.pion_bouge = pion;
        this.boutons.activerBoutons(true,pion);
        }
    }

    
    calculer_force_main(pion_a_pousser, dx, dy) {

        let courant_x = pion_a_pousser.x;
        let courant_y = pion_a_pousser.y;
        let force_actuelle = 1; 
        let compteur_rocher = 0;
        let deja_vu_x = [];
        let deja_vu_y = [];
        
        while (this.estCaseOccupee(courant_x, courant_y) && !(deja_vu_x.includes(courant_x) && deja_vu_y.includes(courant_y))) {
            const pion_courant = this.pieces.find(p => p.x === courant_x && p.y === courant_y);
            deja_vu_x.push(courant_x);
            deja_vu_y.push(courant_y);
            if (!pion_courant) break;
    
            if (pion_courant.type === 'rocher') {
                compteur_rocher += 1;
                if (force_actuelle < compteur_rocher) {
                    return false;
                }
            } else {
                if (pion_courant.orientation === pion_a_pousser.orientation) {
                    force_actuelle += 1;
                }
                else if (this.opposition(pion_a_pousser.orientation, pion_courant.orientation)) {
                    force_actuelle -= 1;
                }
            }
            if (force_actuelle <= 0) {
                return false;
            }
            courant_x += dx;
            courant_y += dy;
        }
    
        return true;
    }
    
    afficher_cases_mouvement_main(x, y, couleur, pion) {
        const directions = [
            { dx: 0, dy: -12, orientation: 0 },  
            { dx: 0, dy: 12, orientation: 180 },   
            { dx: -6, dy: 0, orientation: 270 },   
            { dx: 6, dy: 0, orientation: 90 }     
        ];
    
        const valideDepuisMainOuCoin = (x, y, dx, dy, pion) => {
            const estBordGauche = (x === 35);
            const estBordDroit = (x === 59);
            const estRangeeHaut = (y === 20);  
            const estRangeeBas = (y === 68); 
    
            if (estBordGauche && dx === 6 && dy === 0) return true; 
            if (estBordDroit && dx === -6 && dy === 0) return true; 
        
            if (pion.type === "éléphant" && estRangeeHaut && dy === 12) return true;  
            if (pion.type === "rhino" && estRangeeBas && dy === -12) return true;    
    
            if (pion.type === "éléphant" && estRangeeHaut && dy === -12) return false; 
            if (pion.type === "rhino" && estRangeeBas && dy === 12) return false;    
        
            return false; 
        };
    
        directions.forEach(dir => {
            const cible = this.pieces.find(p => p.x === x && p.y === y);
            if (!cible) return;
            if (!valideDepuisMainOuCoin(x, y, dir.dx, dir.dy, pion)) return;
    
            if (!this.calculer_force_main(cible, dir.dx, dir.dy)) return;
    
            const indicateur = document.createElement('div');
            indicateur.classList.add('indicateur');
            indicateur.style.position = 'absolute';
            indicateur.style.left = `${x + dir.dx / 2}%`;
            indicateur.style.top = `${y + dir.dy / 2}%`;
            indicateur.style.width = '5%';
            indicateur.style.height = '10%';
            indicateur.style.backgroundColor = couleur;
            indicateur.style.opacity = '0.7';
    
            indicateur.addEventListener('click', () => {
                pion.orientation = dir.orientation;
                pion.tournerPion(this.getDirectiondAngle(dir.orientation));
    
                let currentX = x, currentY = y;
                const pionsAPousser = [];
                let first = true;
                while (this.estCaseOccupee(currentX, currentY)) {
                    const piece = this.pieces.find(p => p.x === currentX && p.y === currentY);
                    if (!piece) break;
                    if (first){
                        if (this.estCaseOccupee(currentX, currentY)) {
                            const piece = this.pieces.find(p => p.x === currentX && p.y === currentY);
                            if (piece) {
                                if (
                                    (dir.dx === 6 && piece.orientation === 270) || 
                                    (dir.dx === -6 && piece.orientation === 90) || 
                                    (dir.dy === 12 && piece.orientation === 0) ||  
                                    (dir.dy === -12 && piece.orientation === 180)  
                                ) {
                                    return false;
                                }
                                first = false;
                            }
                        }
                    }
                    pionsAPousser.push(piece);
                    currentX += dir.dx;
                    currentY += dir.dy;
                }
    
                if (!this.estCaseOccupee(currentX, currentY)) {
                    for (let i = pionsAPousser.length - 1; i >= 0; i--) {
                        const piece = pionsAPousser[i];
                        piece.bouger(piece.x + dir.dx, piece.y + dir.dy, true);
                    }
                    pion.bouger(x, y);
                    this.finTour();
                } else {
                    console.log("Poussée impossible.");
                }
    
                this.reinitialiserCases();
            });
    
            this.element.appendChild(indicateur);
        });
    }
    

    
    getDirectiondAngle(angle) {
        switch (angle) {
            case 0: return "haut";
            case 90: return "droite";
            case 180: return "bas";
            case 270: return "gauche";
            default: return null;
        }
    }
    
    resetGame() {
        this.pieces = [];
        this.fin_de_jeu = false;
        this.compteur_tour = 1;
        this.tour_animal = "éléphant";
        this.a_bouge = false;
        this.pion_bouge = null;
    
        this.pieces.forEach(piece => piece.element.classList.remove("highlight-adversary"));
    
        this.element.innerHTML = "";
        this.initialiser_pieces(); 
    
        this.mettreAJourAffichageTour();
        this.boutons.activerBoutons(false, null);
        document.getElementById("end-turn-button").disabled = true;
        document.getElementById("reset-game-button").disabled = false;
        this.highlightActivePieces();
    }
    
    

}
document.addEventListener('DOMContentLoaded', function() {
    const plateauDeJeu = document.getElementById('plateau');
    const plateau = new Plateau(plateauDeJeu);
    plateau.initialiser_pieces();
});