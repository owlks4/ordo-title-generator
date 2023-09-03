var clanPrefixes = {
    "ventrue": "Commanding ",
    "daeva": "Elegant ",
    "mekhet": "Cryptic ",
    "gangrel": "Bestial ",
    "nosferatu": "Haunting "
  };
  
var swornPrefixes = {
    "red_initiate": "Tempered ",
    "red_established": "Stalwart ",
    "red_master": "Courageous ",
    "blue_initiate": "Honoured ",
    "blue_established": "Shrouded ",
    "blue_master": "Hallowed ",
    "black_initiate": "Learned ",
    "black_established": "Enlightened ",
    "black_master": "Blessed "
  };

  var adjectives = {
    "banes": ["Fire","Scalded","Burnt"],
    "beast": ["Fury","Savage","Brutal"],
    "blood": ["Fast","Sanguine","Bleeding"],
    "ouroboros": ["Freedom","Chained","Unbound"],
    "voivode": ["Noble","Indomitable","Regal"],
    "life": ["Fervor","Vital","Living"],
    "heart": ["Feeling","Impaled","Flayed"],
    "labyrinth": ["Trial","Delirious","Bespoke"],
    "stasis": ["Change","Shifting","Amorphous"],
    "predation": ["Hunt","Stalking","Apex"],
    "custom": ["Test","Experimental","Curious"]
  }

var rankTitles = ["Tineri","Supplicant","Scribe","Scholar","Initiate","Adept","Master","Philosopher","Illuminous","Architect","Visionary","Immortal","Auspicious","Genius","Eternal","Olympian","Nuncio","Palatine","Princeps","Magister","Emir","Boyar","Sovereign","Monarch","Caesar","Exarch","Bodhisattva","Transcendentalist","Incarnate","Optimus","Eldritch"];

coilTable = document.getElementById("coilTableBody");
coilRowTemplate = document.getElementById("coilRowTemplate");
resultElement = document.getElementById("result");

function addCoil(){
    newCoilRow = coilRowTemplate.content.cloneNode(true);
    coilTable.appendChild(newCoilRow);
    updateTitle();
}

function removeCoil(removeButtonElement){
    removeButtonElement.parentNode.parentNode.remove();
    updateTitle();
}

class Coil {
    coilName = "";
    rank = "";
    constructor (coilName,rank){
        this.coilName = coilName;
        this.rank = rank;
    }
}

function allCoilsAtSameLevel(coils){

    if (coils.length == 0){
        return false;
    }

    initialValue = coils[0].rank;

    for (let i = 0; i < coils.length; i++){
        if (coils[i].rank != initialValue){
            return false;
        }
    }
    return true;
}

function allUnmasteredCoilsAtSameLevel(coils){

    if (coils.length == 0){
        return false;
    }

    let firstExample = getAnyUnmasteredCoil(coils);

    for (let i = 0; i < coils.length; i++){
        if (coils[i] != firstExample){
            if (coils[i].rank < 3 && coils[i].rank != firstExample.rank){
                return false;
            }
        }
    }
    return true;
}

function hasCoil(coils, coilName){

    if (coils.length == 0){
        return false;
    }

    for (let i = 0; i < coils.length; i++){
        if (coils[i].coilName == coilName){
            return true;
        }
    }
    return false;
}

function hasCoilAtLevel(coils, coilName, rank){

    if (coils.length == 0){
        return false;
    }

    for (let i = 0; i < coils.length; i++){
        if (coils[i].coilName == coilName && coils[i].rank == rank){
            return true;
        }
    }
    return false;
}

function hasAnyCoilAtLevel(coils, rank){

    if (coils.length == 0){
        return false;
    }

    for (let i = 0; i < coils.length; i++){
        if (coils[i].rank == rank){
            return true;
        }
    }
    return false;
}

function getAnyUnmasteredCoil(coils){

    if (coils.length == 0){
        return false;
    }

    for (let i = 0; i < coils.length; i++){
        if (coils[i].rank < 3){
            return coils[i];
        }
    }
    return false;
}

function numberOfMasteredCoils(coils){

    if (coils.length == 0){
        return 0;
    }

    let output = 0;

    for (let i = 0; i < coils.length; i++){
        if (coils[i].rank == 3){
            output++;
        }
    }
    return output;
}

function numberOfUnmasteredCoils(coils){

    if (coils.length == 0){
        return 0;
    }

    let output = 0;

    for (let i = 0; i < coils.length; i++){
        if (coils[i].rank < 3){
            output++;
        }
    }
    return output;
}

function checkForMultipleInstancesOfACoil(coils){
    
    for (let i = 0; i < coils.length; i++){
        if (coils[i].coilName == "custom"){
            continue;
        }
        for (let j = 0; j < coils.length; j++){
            if (i != j && coils[i].coilName === coils[j].coilName){
                return coils[i].coilName;
            }
        }
    }

    return null;
}

function capitalise(input){
    return input.charAt(0).toUpperCase() + input.slice(1)
}

function updateTitle(){
    let output = "";

    let swornType = "none";

    if (document.getElementById("swornRed").checked == true){
        swornType = "red";
    } else if (document.getElementById("swornBlue").checked == true){
        swornType = "blue";
    } else if (document.getElementById("swornBlack").checked == true){
        swornType = "black";
    }

    let swornRankDiv = document.getElementById("swornRankDiv");

    if (swornType != "none"){
        let swornRank = document.getElementById("swornRank").value;
        output += swornPrefixes[swornType+"_"+swornRank];  
        swornRankDiv.className = "displayed"
    } else {
        swornRankDiv.className = "hidden"
    }

    let cumulativeCoilRanks = 0;
    let coils = []
    let primaryCoil = null;
    let secondaryCoil = null;

    for (let i = 0; i < coilTable.children.length; i++){
        let coilNameElement = coilTable.children[i].children[0].children[0];
        let coilName = coilNameElement.options[coilNameElement.selectedIndex].value;
        let coilRank = parseInt(coilTable.children[i].children[1].firstChild.value);
        let coil = new Coil(coilName,coilRank);
        coils.push(coil);
        cumulativeCoilRanks += coilRank;
        if (coil.rank != 3){
            if (primaryCoil == null || coil.rank > primaryCoil.rank){
                if (primaryCoil != null && (secondaryCoil == null || secondaryCoil.rank < primaryCoil.rank)){   //if we're displacing a coil that we had already evaluated to be the primary coil, demote it to secondary instead of removing it entirely
                    secondaryCoil = primaryCoil;
                }
                primaryCoil = coil;
            }
            if ((secondaryCoil == null && coil != primaryCoil) || (coil.rank < primaryCoil.rank && coil.rank > secondaryCoil.rank)){
                secondaryCoil = coil;
            }
        }
    }

    let sanityCheck = checkForMultipleInstancesOfACoil(coils);

    if (sanityCheck != null){
        resultElement.textContent = "You've added multiple instances of Coil of "+capitalise(sanityCheck)+"!\n\nPlease either remove or change the second instance.";
        return;
    }

    let scalesMastered = document.getElementById("scalesMastered").value;
    if (scalesMastered >= 6){
        output += "Armoured ";
    } else if (scalesMastered >= 3){
        output += "Plated ";
    }

    if (numberOfMasteredCoils(coils) >= 3 && hasCoilAtLevel(coils,"blood",3) && hasCoilAtLevel(coils,"beast",3) && hasCoilAtLevel(coils,"banes",3)){
        output += "Draconic ";
    }
    else if (numberOfMasteredCoils(coils) >= 3){
        output += "Travelling ";
    }
    else if (numberOfMasteredCoils(coils) >= 1){
        for (let i = 0; i < coils.length; i++){
            if (coils[i].rank == 3){
                output += adjectives[coils[i].coilName][2] + " ";    
            }
        }
    }

    let clan = document.getElementById("clan").value;
    output += clanPrefixes[clan];

    output += rankTitles[cumulativeCoilRanks];

    if (numberOfUnmasteredCoils(coils) > 0){
            output += " of the ";

            if (numberOfUnmasteredCoils(coils) >= 6){
                output += "Sidereal ";
            }
            else if (numberOfUnmasteredCoils(coils) >= 5){
                output += "Aetherial ";
            }
            else if (numberOfUnmasteredCoils(coils) >= 4){
                output += "Invisible ";
            }
            
            if (secondaryCoil != null && !allUnmasteredCoilsAtSameLevel(coils)){
                output += adjectives[secondaryCoil.coilName][1];
            } else if (numberOfUnmasteredCoils(coils) == 1){
                output += "Dedicated ";
            }
            
            output += " ";
            
            if (numberOfUnmasteredCoils(coils) > 1 && allUnmasteredCoilsAtSameLevel(coils) && hasCoil(coils,"blood") && hasCoil(coils,"beast") && hasCoil(coils,"banes") && !hasCoilAtLevel(coils,"blood",3) && !hasCoilAtLevel(coils,"beast",3) && !hasCoilAtLevel(coils,"banes",3)){
                output += "Fundament";
            }
            else if (numberOfUnmasteredCoils(coils) > 1 && allUnmasteredCoilsAtSameLevel(coils)){
                output += "Equilibrium";
                output = output.replace("of the","of");
            }
            else if (primaryCoil != null){
                output += adjectives[primaryCoil.coilName][0]; 
            }
    }

    resultElement.textContent = output;

    document.documentElement.className = clan;
}

document.getElementById("swornNone").checked = true;
updateTitle();