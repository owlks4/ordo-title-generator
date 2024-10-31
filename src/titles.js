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
    "predation": ["Hunt","Stalking","Apex"]
  }

var rankTitles = ["Tineri","Supplicant","Scribe","Scholar","Initiate","Adept","Master","Philosopher","Illuminous","Architect","Visionary","Immortal","Auspicious","Genius","Eternal","Olympian","Nuncio","Palatine","Princeps","Magister","Emir","Boyar","Sovereign","Monarch","Caesar","Exarch","Bodhisattva","Transcendentalist","Incarnate","Optimus","Eldritch"];

coilTable = document.getElementById("coilTableBody");
coilRowTemplate = document.getElementById("coilRowTemplate");
resultElement = document.getElementById("result");

let useShorthandTitleCheckbox = document.getElementById("shorthand-checkbox");

let priorityColHeaders = [document.getElementById("prioritise-1-column-header"), document.getElementById("prioritise-2-column-header")]

if (window.innerWidth < window.innerHeight) {
    document.documentElement.className = "mobile-font-size"
    document.getElementById("result").style = "max-width:70vw;"
}

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


function numberOfUnmasteredCustomCoils(coils){

    if (coils.length == 0){
        return 0;
    }

    let output = 0;

    for (let i = 0; i < coils.length; i++){
        if (coils[i].coilName == "custom" && coils[i].rank < 3){
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

function getInvisibleAetherialOrSidereal(coils){
    if (numberOfUnmasteredCoils(coils) >= 6){
        return "<span title='has six or more in-progress coils'>Sidereal </span>";
    }
    else if (numberOfUnmasteredCoils(coils) >= 5){
        return "<span title='has five in-progress coils'>Aetherial </span>";
    }
    else if (numberOfUnmasteredCoils(coils) >= 4){
        return "<span title='has four in-progress coils'>Invisible </span>";
    } else {
        return "";
    }
}

function capitalise(input){
    return input.charAt(0).toUpperCase() + input.slice(1)
}

function hasHigherRankThanAllCoilsInThisArray(c, arr){
    for(let i = 0; i < arr.length; i++){
        if (c.rank <= i.rank){
            return false;
        }
    }
    return true;
}

function getRelevantRadButton(coil, primarySecondaryType){
    return primarySecondaryType == "primary" ? coil.priorityPrimaryRadioButton : coil.prioritySecondaryRadioButton;
}

function retrieveThePrioritisedCoilFromArray(arr, type, allCoils){

    if (arr.length == 0){
        return null;
    }

    if (arr.length == 1){
        console.log("Only 1 relevant in "+type+" category")
        getRelevantRadButton(arr[0], type).checked = true;
        allCoils.forEach((coil) => {
            getRelevantRadButton(coil, type).disabled = true;
        });
        return arr[0];
    }

    let isAnyCoilInListChecked = false;

    allCoils.forEach((coil) => {
        if (arr.includes(coil)) {
            getRelevantRadButton(coil, type).disabled = false;
        } else {
            getRelevantRadButton(coil, type).disabled = true;
        }
    });

    for (let i = 0; i < arr.length; i++){
        let radButton = getRelevantRadButton(arr[i], type);
        if (radButton.checked){
            console.log("Is any became true")
            isAnyCoilInListChecked = true;
        }
    }
    if (!isAnyCoilInListChecked){ //if no radio buttons were checked, use this to make sure at least one of them is.
        let firstRelevantRadioButton = getRelevantRadButton(arr[0], type);
        console.log("Checking first in "+type+" list")
        firstRelevantRadioButton.checked = true;
    }

    for (let i = 0; i < arr.length; i++){
        let radButton = getRelevantRadButton(arr[i], type);
        if (radButton.checked){
            return arr[i];
        }
    }
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
        output += "<span title='Sworn rank: "+swornType + " " + swornRank+"'>"+swornPrefixes[swornType+"_"+swornRank]+"</span>";  
        swornRankDiv.className = "displayed"
    } else {
        swornRankDiv.className = "hidden"
    }

    let cumulativeCoilRanks = 0;
    let coils = []
    let primaryCoil = null;
    let secondaryCoil = null;

    let allCoilsThatCouldBePrimary = [];
    let allCoilsThatCouldBeSecondary = [];

    for (let i = 0; i < coilTable.children.length; i++){
        let coilNameElement = coilTable.children[i].children[0].children[0];
        let coilName = coilNameElement.options[coilNameElement.selectedIndex].value;
        let coilRank = parseInt(coilTable.children[i].children[1].firstChild.value);
        if (isNaN(coilRank)){
            coilRank = 1;
        } else if (coilRank > 3){
            coilRank = 3;
        } else if (coilRank < 1){
            coilRank = 1;
        }        
        let coil = new Coil(coilName,coilRank);

        coil.priorityPrimaryRadioButton = coilTable.children[i].children[3].firstChild;
        coil.priorityPrimaryRadioButton.oninput = ()=>{updateTitle();};

        coil.prioritySecondaryRadioButton = coilTable.children[i].children[4].firstChild;
        coil.prioritySecondaryRadioButton.oninput = ()=>{updateTitle();};

        coils.push(coil);
        cumulativeCoilRanks += coilRank;
    }

    coils.sort((a,b)=>{return a.rank == b.rank ? 0 : (a.rank > b.rank ? -1 : 1)}); //sort coils into reverse rank order (so that the primary/secondary calculations flow naturally and we don't have to constantly dethrone coils that were previously thought to hold the position but actually don't)

    coils.forEach((coil) => {
        if (coil.rank != 3 && coil.coilName != "custom"){
            if (allCoilsThatCouldBePrimary.length == 0){ //if we're the first coil below three tiers to be processed, because we ordered by rank, it must be a primary coil
                allCoilsThatCouldBePrimary = [coil];
            } else if (coil.rank == allCoilsThatCouldBePrimary[0].rank){ //if we're the same rank as the first primary coil, then this is also a primary coil
                allCoilsThatCouldBePrimary.push(coil);
            } else if (allCoilsThatCouldBeSecondary.length == 0){ //otherwise, we must be secondary. if we're the first secondary, populate the secondary list with us.
                allCoilsThatCouldBeSecondary = [coil];
            } else if (coil.rank == allCoilsThatCouldBeSecondary[0].rank){ //if we're the same rank as the first secondary coil, then this is also a secondary coil
                allCoilsThatCouldBeSecondary.push(coil);
            }
        }
    });

    if (coils.length == 0){
        priorityColHeaders.forEach(priorityHeader => {
            priorityHeader.style = "opacity:0";
        });
    } else {
        priorityColHeaders.forEach(priorityHeader => {
            priorityHeader.style = "opacity:0.5";
        });
    }

    primaryCoil = retrieveThePrioritisedCoilFromArray(allCoilsThatCouldBePrimary, "primary", coils);

    allCoilsThatCouldBePrimary.forEach(coil => {  //all primary coils that are not the one on display now get pushed into being secondary coils
        if (coil != primaryCoil){
            allCoilsThatCouldBeSecondary.push(coil);
        }
    });
 
    secondaryCoil = retrieveThePrioritisedCoilFromArray(allCoilsThatCouldBeSecondary, "secondary", coils);

    let sanityCheck = checkForMultipleInstancesOfACoil(coils);

    if (sanityCheck != null){
        resultElement.innerHTML = "You've added multiple instances of Coil of "+capitalise(sanityCheck)+"!\n\nPlease either remove or change the second instance.";
        return;
    }

    if (cumulativeCoilRanks > 30){
        resultElement.innerHTML = "Keep it up! 99% of Ordo quit just before they achieve ascension 🙂";
        return;
    }

    let scalesMastered = document.getElementById("scalesMastered").value;
    if (scalesMastered >= 6){
        output += "<span title='has at least 6 scales'>Armoured </span>";
    } else if (scalesMastered >= 3){
        output += "<span title='has at least 3 scales'>Plated </span>";
    }

    if (useShorthandTitleCheckbox.checked && numberOfMasteredCoils(coils) >= 3 && hasCoilAtLevel(coils,"blood",3) && hasCoilAtLevel(coils,"beast",3) && hasCoilAtLevel(coils,"banes",3)){
        output += "<span title='has mastered at least the three core coils'>Draconic </span>";
    }
    else if (useShorthandTitleCheckbox.checked && numberOfMasteredCoils(coils) >= 3){
        output += "<span title='has mastered at least three coils, at least one of which is not in the three core coils'>Travelling </span>";
    }
    else if (numberOfMasteredCoils(coils) >= 1){
        for (let i = 0; i < coils.length; i++){
            if (coils[i].rank == 3 && coils[i].coilName != "custom"){
                output += "<span title='has mastered coil of "+coils[i].coilName+"'>"+adjectives[coils[i].coilName][2] + " </span>";    
            }
        }
    }

    if (numberOfUnmasteredCoils(coils) <= numberOfUnmasteredCustomCoils(coils)){ //if all your unmastered coils are custom coils, then reckon sidereal etc here, because they won't fire later on as there won't be a primary or secondary coil
        output += getInvisibleAetherialOrSidereal(coils);
    }

    let clan = document.getElementById("clan").value;
    output += "<span title='member of clan "+clan+"'>"+clanPrefixes[clan]+"</span>";

    let rankTitle = rankTitles[cumulativeCoilRanks];
    if (rankTitle == undefined){
        rankTitle = "Undefined";   
    }
    output += "<span title='has "+cumulativeCoilRanks+" total coil tiers'>"+rankTitle+"</span>";

    if ((numberOfUnmasteredCoils(coils) > 0 && numberOfUnmasteredCoils(coils) > numberOfUnmasteredCustomCoils(coils)) || hasCoil(coils,"custom")){
            output += " of the ";

            if(hasCoil(coils,"custom")){
                if (numberOfUnmasteredCoils(coils) == 1){
                    output += "<span title='has only a single in-progress coil'>Dedicated </span>";
                } 
                output += "<span title='Eldritch coil'>Experimental </span>";
            }

            output += getInvisibleAetherialOrSidereal(coils);       
            
            if (secondaryCoil != null && !(useShorthandTitleCheckbox.checked && allUnmasteredCoilsAtSameLevel(coils))){
                output += "<span title='Secondary coil is coil of "+secondaryCoil.coilName+"'>"+adjectives[secondaryCoil.coilName][1]+"</span>";
            } else if (numberOfUnmasteredCoils(coils) == 1 && !hasCoil(coils,"custom")){
                output += "<span title='has only a single in-progress coil'>Dedicated </span>";
            }
            
            output += " ";
            
            if (useShorthandTitleCheckbox.checked && numberOfUnmasteredCoils(coils) > 1 && allUnmasteredCoilsAtSameLevel(coils) && hasCoil(coils,"blood") && hasCoil(coils,"beast") && hasCoil(coils,"banes") && !hasCoilAtLevel(coils,"blood",3) && !hasCoilAtLevel(coils,"beast",3) && !hasCoilAtLevel(coils,"banes",3)){
                output += "<span title='has the three core coils at the same level'>Fundament</span>";
            }
            else if (useShorthandTitleCheckbox.checked && numberOfUnmasteredCoils(coils) > 1 && allUnmasteredCoilsAtSameLevel(coils)){
                output += "<span title='All unmastered coils are at the same level'>Equilibrium</span>";
                output = output.replace("of the","of");
            }
            else if (primaryCoil != null){
                output += "<span title='Primary coil is coil of "+primaryCoil.coilName+"'>"+adjectives[primaryCoil.coilName][0]+"</span>"; 
            }
    }

    resultElement.innerHTML = output;

    document.body.className = clan;
}

document.getElementById("swornNone").checked = true;
updateTitle();