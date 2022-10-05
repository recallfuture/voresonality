//=======================
//Variable Initialization
//Self explainatory...
//====================

// Keeps track of test progression
// 0 = menu, 1 = in test, 2 = end of test
var testState = 0

// UI Elements

var predTest = document.getElementById('pred-button'),
    wpreyTest = document.getElementById('wprey-button'),
    upreyTest = document.getElementById('uprey-button'),
    stragr = document.getElementById('stragr-button'),
    agr = document.getElementById('agr-button'),
    na = document.getElementById('na-button'),
    dis = document.getElementById('dis-button'),
    strdis = document.getElementById('strdis-button'),
    title = document.getElementById('title'),
    title2 = document.getElementById('results-desc-header-title'),
    textarea = document.getElementById('results-desc-header-type-desc'),
    textareaheader = document.getElementById('results-desc-header-quote'),
    textarea2 = document.getElementById('results-desc-text'),
    textarea3 = document.getElementById('results-desc-score-text'),
    textarea4 = document.getElementById('textarea4'),
    backbtn = document.getElementById('back-button'),
    resetbtn = document.getElementById('reset-button'),
    body = document.body,
    progressbar = document.getElementById('progressbar'),
    progressbarfill = document.getElementById('progress-bar-full'),
    scorestable = document.getElementById('scores-table'),
    scoreI = document.getElementById('score-individual'),
    scoreS = document.getElementById('score-shared'),
    scoreV = document.getElementById('score-visceral'),
    scoreE = document.getElementById('score-emotional'),
    scoreA = document.getElementById('score-active'),
    scoreP = document.getElementById('score-passive'),
    scoreX = document.getElementById('score-sexual'),
    scoreN = document.getElementById('score-sensual'),
    resetbtn2 = document.getElementById('reset-button-2'),
    shareLink = document.getElementById('results-share');

// Scores
var I = 0,
    S = 0,
    V = 0,
    E = 0,
    A = 0,
    P = 0,
    X = 0,
    N = 0;

// upreyStatements = [
//     // Individual
//     {question: 'I roll my eyes at predators who tell me how hungry they are.', answers: [{type:'I', value: 3},{type:'I', value: 1},{type:null, value: null},{type:'S', value: 1},{type:'S', value: 3}]},

//Test Statements Small Note: If these are the same thing it causes problems when loading a results page (This does not happen after a test is takes as these ger replaced with the correct data from the json file)
var predStatements = "PRED",

    wpreyStatements = "WPREY",

    upreyStatements = "UPREY";

//TestLogic

var testType = '',
    type = '',
    FinalScore = '',
    questionNo = 0,
    questions,
    scoreHist = [];

var typeDesc = '';

//=====================
//Event Listener Adding
//Area for adding event listeners
//===============================

//Test Type Buttons
predTest.addEventListener('click', function () {
    changeTheme("var(--pred)")
    startTest("data/pred.json");
    testType = "PRED";
});
wpreyTest.addEventListener('click', function () {
    changeTheme("var(--wPrey)")
    startTest("data/wprey.json");
    testType = "WPREY";
});
upreyTest.addEventListener('click', function () {
    changeTheme("var(--uPrey)")
    startTest("data/uprey.json");
    testType = "UPREY";
});

//Test Answers
stragr.addEventListener('click', function () {
onAnswer(4);
});
agr.addEventListener('click', function () {
    onAnswer(3);
});
na.addEventListener('click', function () {
    onAnswer(2);
});
dis.addEventListener('click', function () {
    onAnswer(1);
});
strdis.addEventListener('click', function () {
    onAnswer(0);
});

//Back Button
backbtn.addEventListener('click', function () {
    if (questionNo > 0) {
        prevQuestion();
    }
});

//Reset Buttons
resetbtn.addEventListener('click', function () {
    if (confirm("Are you sure? You will lose all saved data!")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
    else { }

});
resetbtn2.addEventListener('click', function () {
    if (confirm("Are you sure? You will lose all saved data!")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
    else { }

});

//Share Button
shareLink.addEventListener('click', function () { sentToClipboard() });

//======================
//Data Loading Functions
//Functions that deal with external data
//======================================

//Used to load a JSON File
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//Desc: (Currently) copies page url to user's clipboard (with warning).
function sentToClipboard() {
    // Text to copy
    var text = window.location.toString();
    // Sending it to the clipboard
    if (confirm("This will copy the link to your results to your clipboard. Continue?")) navigator.clipboard.writeText(text);
}

//===================
//Test Data Functions
//Functions that purely deal with test data
//=========================================

//Resets test data
function resetScores() {
    testState = 0;
    scoreHist = [];
    (I = 0), (S = 0), (V = 0), (E = 0), (A = 0), (P = 0), (X = 0), (N = 0);
    type = '';
    questionNo = 0;
}

//========================
//Auxillary Test Functions
//Functions that deal with other test features (mainly graphics, sometimes data)
//==============================================================================

//Desc: Begins the actual test
//Args: (str) questionData - relative location of the queestion data JSON to load
function startTest(questionData) {

    //Set vars
    resetScores();
    testState = 1;
    questionNo = 0;

    //Attempt to load questions
    try {
        readTextFile(questionData, (text) => {
            questions = JSON.parse(text);
            //console.log(questions); for debug
            nextQuestion();
            //title.innerText = title.innerText + ' - Predator';
            //testType = predStatements;
            //resetScores();
            //hideType();
            //showOptions();
            //document.body.className = 'predbody';
            //document.getElementById('progress-bar').className += 'progress-bar';
            //document.getElementById('progress-bar-full').className += 'progress-bar-full';

            //console.log(JSON.stringify(questions, null, 2));
        });
    }
    catch (err) {
        //Some sort of alert...
    }

    //UI update
    //console.log(questions); for debug
    document.getElementById('progress-bar-full').style.width = 0; //Set bar (back) to 0
    backbtn.setAttribute('disabled', ''); //Disable back button
    hideMenu('main-menu'); //Hide main menu
    showMenu('test-menu'); //Show test menu
}

//Checks which score to change
function typeCheck(type, value) {
    switch (type) {
        case 'I':
            I = I + value;
            break;
        case 'S':
            S = S + value;
            break;
        case 'V':
            V = V + value;
            break;
        case 'E':
            E = E + value;
            break;
        case 'A':
            A = A + value;
            break;
        case 'P':
            P = P + value;
            break;
        case 'X':
            X = X + value;
            break;
        case 'N':
            N = N + value;
            break;
    }
}

//Desc: When an answer is given...
//Args: (int) index - current question number
function onAnswer(index) {
    //Get current score to history
    scoreHist.push([I, S, V, E, A, P, X, N]);
    
    //Calc new score
    let answer = questions[questionNo].answers[index];
    if (answer.type != null && answer.value != null) {
        typeCheck(answer.type, answer.value);
    }
    questionNo++;
    if (checkFinal()) {
        return;
    };

    //load next question
    nextQuestion();
}

//Desc: Displays next question and sets it's type
function nextQuestion() {
    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //console.log(scoreHist)
    if (questionNo >= 0 && questionNo <= 4) { questionType = 'I'; }
    else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    //Enable back button
    if (questionNo > 0) backbtn.removeAttribute('disabled');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = (questionNo + 1) + '/' + + questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Displays previous question and sets it's type
function prevQuestion() {

    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //Decrement question number
    questionNo--;
    //Sets last score
    lastScores = scoreHist.pop();
    I = lastScores[0]
    S = lastScores[1]
    V = lastScores[2]
    E = lastScores[3]
    A = lastScores[4]
    P = lastScores[5]
    X = lastScores[6]
    N = lastScores[7]
    //Sets question type
    if (questionNo >= 0 && questionNo <= 4) { questionType = 'I'; }
    else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    if (questionNo == 0) backbtn.setAttribute('disabled', '');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = (questionNo + 1) + '/' + questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Checks if current question is final
function checkFinal() {
    if (questionNo >= questions.length) {
        finalResult();
        return true;
    }
    return false;
}

//Desc: Reset graphics to main menu
function resetTest() {
    changeTheme('var(--menu)');
    hideMenu('test-menu');
    hideMenu('results-menu')
    showMenu('main-menu');
}

//Desc: Displays a given menu
//Args: (str) menu - id of menu
function showMenu(menu) {
    
    switch (menu) {
        case "results-menu":
            document.getElementById(menu).style.display = "flex";
            break;
        default: //usual case
            document.getElementById(menu).style.display = "inline";
            break;
    }
}

//Desc: Hids a given menu
//Args: (str) menu - id of menu
function hideMenu(menu) {
    document.getElementById(menu).style.display = "none"
}

//Desc: Changes the theme color
//Args: (str) color - css value (inclueding 'var()')
function changeTheme(color) {
    document.querySelector(':root').style.setProperty('--currentTheme', color);
}

//=====================
//Functions To Sort Out
//=====================

function debugMode() {
    textarea2.innerText =
        I + ' ' + S + ' ' + V + ' ' + E + ' ' + A + ' ' + P + ' ' + X + ' ' + N;
    title.innerText = questionType;
}

function finalResult() {
    console.log(testType)
    typeDesc = '';
    type = '';
    if (I >= S) {
        type = type + 'I';
        typeDesc = typeDesc + '[I]ndividual / ';
    } else {
        type = type + 'S';
        typeDesc = typeDesc + '[S]hared / ';
    }
    if (V >= E) {
        type = type + 'V';
        typeDesc = typeDesc + '[V]isceral / ';
    } else {
        type = type + 'E';
        typeDesc = typeDesc + '[E]motional / ';
    }
    if (A >= P) {
        type = type + 'A';
        typeDesc = typeDesc + '[A]ctive / ';
    } else {
        type = type + 'P';
        typeDesc = typeDesc + '[P]assive / ';
    }
    if (X >= N) {
        type = type + 'X';
        typeDesc = typeDesc + 'Se[X]ual';
    } else {
        type = type + 'N';
        typeDesc = typeDesc + 'Se[N]sual';
    }
    if (testType == "WPREY") {
        type = type + '-W';
    }
    if (testType == "UPREY") {
        type = type + '-U';
    }
    document.getElementById('results-desc-header-type').innerText = type;
    // document.getElementById('results-desc-text').innerText = 'Your type is: ' + type; Could not find use
    // textarea.innerText = typeDesc;
    descriptions();
    window.location.hash = `#${type}/${I}-${S}-${V}-${E}-${A}-${P}-${X}-${N}`;
    //shareLink.setAttribute('href', window.location.toString());

    hideMenu('test-menu');
    showMenu('results-menu');

}

function descriptions() {

    switch (type) {
        /* PREDATOR DESCRIPTIONS */
        case 'IVAN':
            title2.innerText = '悍胃者';
            textarea.innerText = typeDesc;
            textareaheader.innerText = "“你现在全身上下都是我的啦！小点心！”";
            textarea2.innerText =
                '所谓的顶级捕食者。IVAN捕食者将填饱肚子视作首要任务，而这个世界上有许多美味的猎物能够满足这个要求。她们会积极地狩猎，追捕猎物的唯一目的就是满足她们那无法满足的饥饿感。猎物们也许会踢打和挣扎，但是作为食物链的顶端，她们总会是最后的赢家。她们通常不会在意猎物的感受。她们可以吃掉任何人，只要猎物是美味的，她们都会一视同仁地享受。 \n';
            break;
        case 'IVAX':
            title2.innerText = '饕餮';
            textareaheader.innerText =
                "“嗯~随便你怎么挣扎，这里可没有出去的路哦？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "食欲是一回事，肉欲又是另一回事了。当一些倒霉蛋被吞掉、从喉咙中滑下时，他们不禁会为她的肉体做出贡献，还会为她带来一个充满激情的有趣夜晚。IVAX捕食者陶醉于蠕动的猎物，尤其是一个懂得如何正确地推拿每一个正确方位的猎物。 \n";
            break;
        case 'IVPN':
            title2.innerText = '蜘蛛';
            textareaheader.innerText =
                "“你知道的，如果你承认自己也想要这样，事情会容易得多~”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IVPN不会主动寻找猎物。她们知道只要自己有足够耐心，，食物就会主动送到面前。这种狩猎策略通常会让她们感到饥饿，所以一旦猎物送上门，她们就会毫不犹豫地吃掉他们，享受这顿来之不易的大餐。所谓“不经一番寒彻骨，怎得梅花扑鼻香”……嗯？不是这么用的吗？ \n";
            break;
        case 'IVPX':
            title2.innerText = '塞壬';
            textareaheader.innerText =
                "“来吧……难道你不想成为这个美丽形体的一部分吗？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "和IVPN不同，IVPX捕食者会在吃掉猎物之前考虑他们的长相。她们喜欢可爱或者有魅力的猎物，这能在说不清的方面上让猎物显得更加美味。另一方面，她们可能只是想要最优质的的猎物进入自己的身体，因为她们知道在猎物被消化之后，她们身体的曲线将会变得更加引人注目。 \n";
            break;
        case 'IEAN':
            title2.innerText = '求索者';
            textareaheader.innerText =
                "“随你怎么挣扎吧，这改变不了我们之间的关系。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEAN捕食者有她们自己的捕食他人的理由——不管是用伤害过自己的人来填饱肚子，还是这样能让她们感觉到自己高人一等。她们将“吃”视为一种达成情感目的的手段，这不仅能够满足她们的饥饿感，还能满足她们情感上的需求。  \n";
            break;
        case 'IEAX':
            title2.innerText = '饿霸';
            textareaheader.innerText =
                "“让我康康你的触发开关是什么，好让你一直动下去。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEAX捕食者总是知道该说什么来让自己的猎物蠕动。她们在奚落和嘲弄肚子里的猎物以让他们蠕动的过程中找到乐趣。她们以吞食猎物作为消遣，尤其喜欢能消耗大量精力在她们胃里蠕动的猎物。她们有时会厌倦自愿或被动的猎物，但弄清楚怎样才能让他们有所反应也是一项有趣的挑战。不过，IEAX捕食者并不一定是恶意的，她们可能只是喜欢和猎物调情，在吃掉猎物的时候会戏弄他们。 \n';
            break;
        case 'IEPN':
            title2.innerText = '捕手';
            textareaheader.innerText =
                "“我们都知道我想要这个……那你呢？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEPN捕食者喜欢诱骗她们的猎物产生一种虚假的安全感，她们了解这些，经常暗示他们的命运，但从不会直接说出来。 在某种程度上，IEPN的猎物知道他们只是对方的一顿美餐，但IEPN的自然魅力鼓励着他们继续保持朋友关系。IEPN捕食者吞食猎物是为了和猎物之间保持情感联系的欲望，以及这个过程带来的感觉。她们可以是热情的捕食者，同时也可以是精明的骗子。 ";
            break;
        case 'IEPX':
            title2.innerText = '妖妇';
            textareaheader.innerText =
                "“以我为始，以我为终。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEPX捕食者经常出现在公共场合，等待猎物注意到她们。她们会眨眨眼然后从人群中溜走，将目标引入一个安静的区域，在那里他们可以从身体上以及情感上更好地了解彼此。IEPN捕食者喜欢和猎物先玩玩游戏，引导他们进入一个充满激情之夜（至少是对她们来说），并在猎物最意想不到的时候吞食他们。她们诱人的本性让大多数人都难以抗拒，尽管她们总倾向于被动地等待猎物找上自己。 \n';
            break;
        case 'SVAN':
            title2.innerText = '伙伴';
            textareaheader.innerText = "“朋友，好吃！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAN是比起IVAN更友好的捕食者。她们通常会寻找有主动意愿猎物来满足自己的胃口，并且尽量做到让双方都能愉快地体验整个过程。尽管她们吞食主要还是为了满足自己的饥饿感，但她们共享的天性确保了她们的暴食永远不会优先于猎物的舒适感。 \n';
            break;
        case 'SVAX':
            title2.innerText = '东道主';
            textareaheader.innerText = "“希望你会对此感到舒适。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX捕食者喜欢在主线开始之前先让猎物感到舒服，清楚细致地描述接下来会在他们身上发生的事情。她们会解释自己正饥肠辘辘并且渴望被填饱，以及这对自己以及猎物来说是件多好的事。她们的热情富有感染力，甚至能够说服最不情愿的猎物。 她们可以使用技能来欺骗猎物，但她们中的大部分还是更希望自己的猎物能对结局满意。 \n';
            break;
        case 'SVPN':
            title2.innerText = '动心者';
            textareaheader.innerText =
                "“真的很抱歉！但是我实在是太饿了……”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVPN捕食者一直在和她们的冲动作斗争，她们有很多的猎物朋友，但当胃开始咆哮时，她们所能想到的就是吃掉他们。尽管屈从本能并开始吞食大量猎物这种事十分美好，但她们一直在努力忽视这种想法。找到一个愿意被捕食的同伴对于SVPN捕食者来说是一种莫大的解脱——如果她们能说服自己只吃一个的话。 \n';
            break;
        case 'SVPX':
            title2.innerText = '贪色者';
            textareaheader.innerText =
                "“涩涩是很棒啦，不过你有试过被吞掉吗？啊呜！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '狂野的激情之夜通常以SVPX的饱腹而告终。她们会在某一刻迷失自我，想要更深入地去感受她们的伴侣。她们可能会用vore的方式来让自己或者伴侣达到高潮，或者作为共度时光后拥抱他们的一种方式。无论如何，SVPX捕食者是那种有着旺盛食欲的恋人。 \n';
            break;
        case 'SEAN':
            title2.innerText = '守护者';
            textareaheader.innerText = "“征服我的心的方法就是征服我的胃！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SEAN捕食者喜欢和她们的朋友保持亲密的关系，而要这样的话还有啥方法能比负距离接触更好呢？这种捕食者喜欢和胃里的猎物共度美好时光，即使是在日常生活中也经常会把他们装在肚子里很长时间。SEAN捕食者可能是endosoma的候选者，因为她们喜欢把猎物放在肚子里，以获得情感上的安慰。 \n';
            break;
        case 'SEAX':
            title2.innerText = '收藏家';
            textareaheader.innerText =
                "“我希望我们能一直在一起，永不分开……”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEAX捕食者在猎物方面非常注重质量。她们是社交动物，喜欢结识任何能吸引她们眼球的有魅力的人。她们鼓励猎物探索自己的身体，并就他们最终要去的地方发表意见——尽管他们可能最后要去的会是更“有趣”的地方。她们“共享”和“情绪化”的特质使得她们在积极地“狩猎”时对于自愿的猎物会有强烈的偏好。在非致命的场景中，这些捕食者会不断地提醒猎物对自己的身体做出了多少贡献，经常会摆各种姿势或者炫耀，并会用朋友的名字和自己的脂肪交谈。  \n";
            break;
        case 'SEPN':
            title2.innerText = '养育者';
            textareaheader.innerText =
                "“怎样？舒服吗？想出来的时候跟我说一声噢。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEPN捕食者喜欢让她们的猎物感到温暖和舒适，经常在吞食之前以及之后用慰藉的话来鼓励他们。 她们倾向于保护猎物的安全，不愿意做任何会对猎物造成伤害的事情（例如消化）。一些SEPN捕食者甚至根本不认为自己是捕食者，只有在猎物靠近她们并且寻求体验时才会选择进食。 \n";
            break;
        case 'SEPX':
            title2.innerText = '浪漫主义者';
            textareaheader.innerText =
                "“我希望在我的体内感受你，但前提是你愿意。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "浪漫主义者，恋人，激情的追求者。SEPX比任何人都更了解vore的亲密本质。这是两人之前热情的展现，他们都想要同样的东西：一种无与伦比的亲密。SEPX不会主动寻找猎物，而是为他们提供自由探索自己身体的机会。一旦进入到她们体内，SEPX就会在她们自己以及猎物的兴奋中获得巨大的性快感。她们通常选择在完成之后把猎物吐出来，或者至少找到复活的方法，因为SEPX捕食者和她们吃掉的人建立了紧密的联系，不希望他们因此受到伤害。 \n";
            break;

        /* WILLING PREY DESCRIPTIONS */

        case 'IVAN-W':
            title2.innerText = 'The Snack';
            textareaheader.innerText =
                "'What're you waiting for? Open up so I can dive in!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're not sure when it started, but you have a strange desire to be eaten. Perhaps it was the tight embrace of the throat, the low gurgles of a stomach or imagining yourself hanging off the waist of some lucky predator, but you knew you were destined to be food. You seek out predators and try to actively get eaten by them, to the point that most know you mostly as being a willing snack who's always up to be devoured. \n";
            break;
        case 'IVAX-W':
            title2.innerText = 'The Thrillseeker';
            textareaheader.innerText =
                "'Your tongue looks so slimy, I can't wait to feel it all over me~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're active in the pursuit of your vorish dreams, turning your fantasies into reality with each predator you meet. Some are taken aback by just how eager you are, but the motions you make in their stomach after you're devoured clear up any doubts. To you, being eaten is a fetish, and it's one you'll do anything to experience. \n";
            break;
        case 'IVPN-W':
            title2.innerText = 'The Patient';
            textareaheader.innerText =
                "'I'm not sure what's taking them so long, aren't I delicious enough already?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You are no stranger to waiting. You often listen to other prey talking about predators they've had experiences with. While you'd love to feel the warm embrace of a stomach, your passive nature prevents you from approaching predators. Instead, you wait, knowing sooner or later a predator will hunt you down and devour you. \n";
            break;
        case 'IVPX-W':
            title2.innerText = 'The Daydreamer';
            textareaheader.innerText = "'Wh-what? Sorry, I was distracted.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You're caught in an almost constant state of fantasizing about being prey. The hot breath of a predator, their warm tongue between your legs as you slide down their throat. These daydreams make you squirm in delight, but you can't bring yourself to act on them. Still, if a predator were to corner you or put the offer forward... \n";
            break;
        case 'IEAN-W':
            title2.innerText = 'The Worshipper';
            textareaheader.innerText =
                "'It's so soothing, please don't ever let me go.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Something about stomachs make you feel at peace. You've never known comfort like the embracing walls of a gut. The IEAN-W prey seeks out predators for the emotional comfort they get from them, or the knowledge they are fulfilling their purpose as prey. \n";
            break;
        case 'IEAX-W':
            title2.innerText = 'The Explorer';
            textareaheader.innerText = "'Who's hungry~?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The IEAX-W is a promiscuous prey. They enjoy the emotional elements of vore, finding sexual arousal in the excitement of a gut. However, their Individual nature means that they are not tied down to a single predator. They adventure from place to place, finding new throats to delve down and stomachs to explore. An IEAX-W prey will always have plenty of stories to tell about their experiences. \n';
            break;
        case 'IEPN-W':
            title2.innerText = 'The Wallflower';
            textareaheader.innerText =
                "'A predator who recognises you as food and treats you like it... Mmh, I might have to sit down.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEPN is often confused with the IVPX daydreamer, though any IEPN prey would make it clear their desires are more than simply 'being eaten'. They fantasize about the sensations of the stomach around them as their predator taunts them from the outside, the knowledge that they are nothing but food to the powerful creature that has consumed them. They often don't care who their predator is, just that someday, somehow, they will be approached by someone who can make them feel like a special treat, and devour them in a single gulp. \n";
            break;

        /* Descriptions and Flavour Text To Be Added */

        case 'IEPX-W':
            title2.innerText = 'The Blusher';
            textareaheader.innerText = "'O-oh heck, maws!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The IEPX are easily flustered, blushing at the mere sight of a predator. Their Passive trait leads them to usually being submissive in nature, leaving them at the whims of any predator who can taunt and tease them into arousal. They favour sexually attractive predators, particularly if they can appeal to their Emotional trait. \n';
            break;
        case 'SVAN-W':
            title2.innerText = 'The Committed';
            textareaheader.innerText =
                "'I can't think of anyone I'd rather be eaten by than you.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVAN-W may see themselves as food but, rather than find any predator to sate that desire like their IVAN counterpart, they're reserving themselves for either a friend or perhaps a needy predator. While the relationship between them and their predator remains an exchange when it comes to vore (IE the experience of being eaten for the joy of eating them), the SVAN prey is likely to quickly make predator friends who they can call on when they feel the urge to delve into a stomach. \n";
            break;
        case 'SVAX-W':
            title2.innerText = 'The Flavourful';
            textareaheader.innerText =
                "'Does something smell delicious around here, or is it just me?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The SVAX-W follows their SVAN counterpart of having close relationships with their predators, however with a kinky aspect added into the situation, this prey might desire to make themselves as attractive to potential predators as possible, whether that be dressing provocatively, covering themselves with condiments, or whatever else that might make a potential predator see themselves as a delicious, pleasurable morsel. They actively pursue predators for raunchy encounters, experiencing the excitement of vore along with the compliments they get from those who eat them. \n';
            break;
        case 'SVPN-W':
            title2.innerText = 'The Friend';
            textareaheader.innerText =
                "'You can eat me if you want to, I don't mind.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "While not actively looking to be food, the SVPN-W prey will likely get to know several predators in the hopes that one of them will eventually decide to eat them, rather than try their luck with strangers. If this prey gets to be food to a friend, then they are satisfied, but often they struggle with getting the courage to make their true feelings about being eaten clear to the point where their predator friends might just assume they're not interested. \n";
            break;
        case 'SVPX-W':
            title2.innerText = 'The Pleaser';
            textareaheader.innerText =
                "'Hff, eat me... please, I'm so turned on right now.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'To the SVPX-W, being eaten is the ultimate climax. They seek to create connections with predators who they find attractive in the hopes of being devoured and adding themselves to their form, or just making a bulge in their sexy guts for a while. However, unlike their SVAX counterparts, the SVPX-W would rather the predator do most of the work in taking control and devouring them while they submit to them completely and enjoy the ride. Unlike the SEPX-W, the SVPX focuses on the raw passion in the heat of the moment with their predator, getting pleasure out of pleasing their predator in a potentially unstable feedback loop, if they find the right predator type to match up with. \n';
            break;
        case 'SEAN-W':
            title2.innerText = 'The Eager';
            textareaheader.innerText =
                "'We're such close friends, and I have a way for us to be even closer.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'The SEAN-W prey will often have similar views to their predator counterpart, seeking to spend a lot of time inside of them for fun. This prey will actively encourage this to happen and may give the predator internal belly rubs to help keep themselves inside. They might also wish to become one with their predator, feeling that both parties will be benefited with the prey becoming part of a greater whole. In any case, they are often sociable and are able to form deeper bonds with the other predator archetypes, but may find IV- types too intense. \n';
            break;
        case 'SEAX-W':
            title2.innerText = 'The Flirtatious';
            textareaheader.innerText =
                "'I really enjoy our little talks, but our conversation would be even better with a wall of fat between us~'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAX-W prey is well aware of their interests, and delights in finding predators who match them. They encourage and return sexual teasing and taunting, perhaps goading the predator to into becoming aroused enough to consume their prey in a lust-filled state. If the predator isn't enjoying or returning the teasing, then they likely won't wish to be eaten by them as vore isn't fun unless both sides are happy. They might also seek to become part of an attractive predator, or perhaps to help make a predator more attractive, as they might feel better being part of predator's sexual features or otherwise making them more beautiful. \n";
            break;
        case 'SEPN-W':
            title2.innerText = 'The Servant';
            textareaheader.innerText =
                "'I can't wait to be inside you, or to be a part of you...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEPN-W is a dedicated prey who seeks to feed their predator friends, and someone who finds joy in serving themselves as food for others. They often give their predator complete control, however long they stay they'll be content to sit back and relax deep inside of their friend's body. They perhaps might see themselves as their friend's personal snack or chew toy, to be taken and used whenever they want to play. They can sometimes be mistaken for SVPX 'lovers', but their interests come more from their Sensual trait; the sensation of being eaten is above the sexual exhilaration for these sensitive types. \n";
            break;
        case 'SEPX-W':
            title2.innerText = 'The Devotee';
            textareaheader.innerText = "'Use me however you want.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'While the SEPN-W finds comfort in serving their predator, the SEPX-W finds arousal in being controlled and used by their predator. They might see themselves as an edible sex toy, to be used to pleasure their lover, master or friends whenever they need it. They are willing to give themselves to their lover to sate their sexual desires, up to and including being processed on various levels. Though, being Emotional types, they yearn for teasing and compliments from their predator, as well as building long-term connections. This leads them to having smaller pools of predators to choose from than their SVPX companions, but their relationships are more intimate for it. \n';
            break;

        /* UNWILLING PREY DESCRIPTIONS */

        case 'IVAN-U':
            title2.innerText = 'The Challenger';
            textareaheader.innerText = "'I'm not going down without a fight!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You've been in enough maws to know how to break out of them. Despite multiple escapes, predators keep thinking they can devour you. Maybe some of them think it's a challenge to be able to keep such an active prey down? In any case, the idea that there are people who want to get eaten confuses you greatly, you would never allow yourself to be prey and will punch your way out of anyone who forces it on you.\n";
            break;
        case 'IVAX-U':
            title2.innerText = 'The Evasive';
            textareaheader.innerText =
                "'Wh-what? Of course I don't like it! Let me go!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "You put up a fight at first, but now that you're in a gut your heart begins to flutter in the most peculiar way... are you turned on? Why would you feel aroused at a time like this? The IVAX-U experience some sexual excitement at their situation, but refuse to admit it. Better to keep struggling than stop just because you're horny. \n";
            break;
        case 'IVPN-U':
            title2.innerText = 'The Fatalist';
            textareaheader.innerText = "'Ugh, fine...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'You fought for a little while, but decided to stop. Maybe you had given up, or maybe you were just conserving your strength. The IVPN knows the nature of their universe means that their chances of being eaten by a predator are high, and so when the time comes, they put up the bare minimum of a fight. Passive prey rarely last long against the stomach walls, though perhaps this tactic might bore your predator into letting you go? ...one can only hope. \n';
            break;
        case 'IVPX-U':
            title2.innerText = 'The Swayed';
            textareaheader.innerText =
                "'It's actually not so bad when you get used to it...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IVPX-U is a complicated prey. They know how dangerous being eaten is, how disgusting the innards of a predator are likely to be, but when they are met with this fate they give in. Once the predator begins the process of eating them they find themselves stimulated, having a tongue tasting them is oddly arousing. Perhaps in this sense they aren't as unwilling as they first thought.  \n";
            break;
        case 'IEAN-U':
            title2.innerText = 'The Remorseful';
            textareaheader.innerText = "'You can't do this to me!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEAN-U are melancholic prey. While their willing and predator counterparts find purpose and meaning in the activity, the IEAN-U finds only regret for all the things they never accomplished. They will fight to free themselves and complete their unfinished business. Their E trait is often the strongest weapon in their arsenal, convincing some E, and especially SE, predators to let them go. \n';
            break;
        case 'IEAX-U':
            title2.innerText = 'The Squirmer';
            textareaheader.innerText = "'Aaah, no, let me go!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEAX-U are easily flustered prey. While their Individual nature means they try to avoid being eaten, they can't help but take a second glance when a predator opens their jaws before them. They cover up their arousal through firm struggles and protesting that they aren't prey, often coaxing predators into teasing them more. A predator who wants to get the most out of an IEAX-U prey should focus on teasing them about their fate, telling them how good they tasted and, above all else, taunting them about how much they IEAX-U prey is enjoying themselves. A combination of these three strategies will guarantee them a prey who squirms all night long. \n";
            break;
        case 'IEPN-U':
            title2.innerText = 'The Tragic';
            textareaheader.innerText = "'There really wasn't any escape, was there?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "All hope was lost the moment a predator laid eyes on them. Trapped with a single gulp, stifled by a burp, now nothing more than a meal. The IEPN-U find themselves in situations outside of their control where they are devoured, and often give into their fate immediately. While an IVPN-U would focus more on the concerns about being digested, the IEPN-U is more worried about how people will react when they find out they've been devoured. They are Passive prey, often giving up after a single attempt at escaping or easily silenced by a pat. \n";
            break;

        case 'IEPX-U':
            title2.innerText = 'The Indecisive';
            textareaheader.innerText =
                "'This is kind of hot actually, erf, so long as I don't stay for too long...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The IEPX-U can often be confused for their willing counterpart, though they are much more likely to deny their secret desire to be eaten. Some might have little to no desire to be eaten, but might be too easily aroused or similar that sexual teasing might override whatever resistance they're able to put forward. The IEPX might come to regret their decision once their predator's body has begun to process them or they're otherwise trapped indefinitely. Or, alternatively, they might be willing afterwards, especially if they'll get to live to see this act again. \n";
            break;
        case 'SVAN-U':
            title2.innerText = 'The Feeder';
            textareaheader.innerText =
                "'H-ha, here's another prey! Just don't eat me, alright? Haha...'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The typical SVAN-U prey has predator friends they hang around. They skirt the border of being eaten through socialising with predators and convincing them that they're a better companion than a meal. They often end up as feeders or find prey for predators to avoid ending up as prey themselves, but they are constantly aware that the next stomach they hear growl could be for them. They are often active strugglers when their time finally comes to be devoured. \n";
            break;
        case 'SVAX-U':
            title2.innerText = 'The Voyeur';
            textareaheader.innerText = "'Glad it's them and not me.... yep. Glad.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX-U prey are often onlookers who find strange arousal out of watching vore but fearing being prey. They might be feeders for their predator friends, follow social media trends about predators eating prey, or just stop and watch when someone else is being devoured. Their Active trait encourages them to get closer and closer to the action, until finally they get a bit too close. At this point their arousal turns against them, leaving them wondering how much they can experience before they reach a point of no return. \n';
            break;
        case 'SVPN-U':
            title2.innerText = 'The Gourmet';
            textareaheader.innerText =
                "'I hope you enjoyed that at least, even if it's gross in here.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVPN-U doesn't want to be eaten, but if approached, they are likely to give in and let the predator have their way. Unlike IVPN, however, this prey might make sure that their predator enjoys them at the very least as, if they must be food, they at least should be a memorable meal. While they wouldn't admit it, they do appreciate being complimented on their flavour or how filling they were after being eaten. \n";
            break;
        case 'SVPX-U':
            title2.innerText = 'The Offering';
            textareaheader.innerText =
                "'Mmh, well if this is happening I might as well try to enjoy it.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SVPX-U is similar to the SVPN in almost every way, although their relationship with being devoured differs on their reaction to the outcome. While the SVPN hopes they're at least a filling or delicious meal, the SVPX hopes to find some enjoyment in the confines of the stomach. They often find odd arousal in the predator dominating them, and as such act on it when they're out of view in the predator's stomach. \n";
            break;
        case 'SEAN-U':
            title2.innerText = 'The Humiliated';
            textareaheader.innerText = "'H-how dare you!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAN-U prey finds that their biggest emotional response to being eaten is humiliation. Their Shared nature means that they're easily teased by a predator, and their Emotional trait leads them to focus more on the predator's words than the stomach walls around them. Teasing leaves them quickly kicking up a frenzy to escape while their pride is still intact. \n ";
            break;
        case 'SEAX-U':
            title2.innerText = 'The Closeted';
            textareaheader.innerText =
                "'No I'm not blushing, it's just really hot in here!'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEAX-U prey is close to their SEAN-U counterpart; vulnerable to teasing and goading from predators, especially those they are close to. However unlike the Sensation-focused SEAN, the SEAX-U finds some arousal in the predator's teasing, often leading them to squirm less out of humiliation and more out of trying to hide their arousal at the predator's domination over them. \n ";
            break;
        case 'SEPN-U':
            title2.innerText = 'The Trusting';
            textareaheader.innerText =
                "'Well, okay... but let me out the second I tell you to, alright?'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "The SEPN-U is a reluctant prey who can be coaxed into going inside of someone they trust. They might not want it, but if their companion really does, they will give in and give them the enjoyment they desire. Most will want to get reassurance from their predator that its safe, but despite their desire to be in control they'll often slip into a passive role if their predator begins to act more dominantly. These prey can eventually be worked into willing with the right time and predator, though they need to watch themselves around manipulative IE predator types! \n";
            break;
        case 'SEPX-U':
            title2.innerText = 'The Toy ';
            textareaheader.innerText =
                "'So long as you're enjoying it, I guess it's okay.'";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "Much like the SEPN-U, the SEPX-U is a bit of a reluctant toy. They don't find the same enjoyment in being eaten as their partner does in eating them, but their relationship with the predator is important enough they can often bypass this in order to sate their partner's desires. This level of connection with their predator from the SE traits, combined with their passive approach from the P trait, means that they can often find arousal in the dominance aspect of being eaten, though they still wouldn't consider it to be something they personally enjoy. \n";
            break;
    }

    // Build the Traits Description

    let isDesc = '';
    let veDesc = '';
    let apDesc = '';
    let xsDesc = '';

    if (I >= S) {
        isDesc =
            "<b>自我 (I)</b> 自我型特征表现在角色通常不会花太多心思在对方身上，不会考虑对方的感受，同时也不会花很多精力去让对方体验到舒适的过程。自我的角色不一定讨厌拉长进食的过程以在事先获得一点点的满足，但是到最后，他们都会沉迷于这种结果以取悦自己。如果是自我的非自愿猎物，这种特质就会表现为他们可能不会在意捕食者的意愿，他们只想逃离以不被吞掉。对于自我的自愿猎物，这种特征将会表现为他们会寻求满足自我意愿的想法，而不顾捕食者的态度。 \n";
    } else {
        isDesc =
            "<b>互利 (S)</b> 具有互利型特征的角色只有在对方也满足的情况下才会真正地满足自己。虽然他们依然会想办法满足自己的要求，不过他们也同样会尊重对方的意愿。互利的捕食者更喜欢吞下自愿的猎物，或者也有可能哄骗猎物把他们的食道当作滑梯。如果他们吞下了一个非自愿的猎物（如果不是绝对需要这样的话），他们会感到懊悔，因为他们真正看重猎物的情绪。互利的猎物通常都是自愿的，并且目的是尽可能地在这个过程中取悦他们的捕食者。而具有互利特质的非自愿猎物通常都是勉强自己——他们不想作为食物，但是他们可能还是会接受这个过程。 \n";
    }
    if (V >= E) {
        veDesc =
            '<b>生理导向 (V)</b> 生理导向型角色这么做的原因只是他们需要这么做，或者是这么做有作用。生理导向型的捕食者通常是被他们原始的饥饿驱使，或者是他们生理上需要做出这样的行动，可能是简单地需要支撑生命活动的能量。生理导向型的自愿猎物，通常也是这样——他们想要被吞食，因为这使他们感觉良好，他们在生理上满足于这种经历。生理导向型的非自愿猎物完全是因为他们想要生存而不是被消化，或者是对自己被困囿于捕食者身体内部的疼痛和不舒适的环境的恐惧。 \n';
    } else {
        veDesc =
            '<b>心理导向 (E)</b> 心理导向型角色倾向于关注vore这整个过程背后隐含的意义。心理导向型的捕食者享受和猎物之间的关系，作为对方的一个情感依赖者，或者是统治者，也有可能因为他们享受于把对方裹在腹中，甚至是将对方转化为自己身体的一部分的这种感觉。他们可能更享受于猎物的祈求和挣扎，而生理导向型的捕食者会觉得猎物的动静过于吵闹。心理导向型的自愿猎物也会有类似的表现，沉迷于被吞进对方腹中的感觉，因为这让他们有了被征服的感觉，或者是能在捕食者体内的这种亲密关系，例如：被消化。而心里导向型的非自愿猎物也有一些重要的原因想要逃离——不是因为对这种感觉恐惧，而是因为这对他们来说是被征服——甚至有可能失去生命。 \n';
    }
    if (A >= P) {
        apDesc =
            "<b>主动 (A)</b> 主动的角色会用自己的办法让vore的行为真实发生，从而达到他们自己的想法。这种特质在捕食者身上就很重要——主动的捕食者有规律地狩猎，或者普遍在寻求能够吞下别人的机会。一旦他们找到了他们中意的猎物，主动的捕食者通常会想办法吞下他们，并且有可能会施加一点强制力在猎物身上以达到他们想要的目标。主动的猎物当然会明确拒绝，并且挣扎。或者，对于自愿猎物，他们可能会有意图地寻找或者鼓励捕食者将他们当作一顿美餐。 \n";
    } else {
        apDesc =
            "<b>被动 (P)</b> 被动的角色通常被事情的发展所裹挟着，一般是“自己正处于某种情况”而不是“自己创造了某种情况”。被动的捕食者倾向于等待，并且观察潜在的猎物，而不是直接抓一只——有可能是想出一个非常详细的计划让猎物自投罗网，或者是用自己诱人的身体引诱猎物靠近。被动的捕食者也经常不把自己看作捕食者，或者在猎物围绕着自己的时候也不为所动（当然在诱惑太强烈的时候也会控制不了自己）。被动的猎物，在当捕食者抓住自己的时候很自然地就会贡献自己——当然会有很多原因，有可能是绝望地服从，也有可能是快感。有被动特质的自愿猎物乐意于满足捕食者的奇思妙想，有可能作为食物，或者是“玩具“的身份。而被动特质的非自愿猎物自然会看起来更加怯懦——如果他们觉得没有希望，甚至会放弃挣扎（而主动特质的猎物倾向于一直挣扎，无论逃脱的希望看起来多么渺茫）。 \n";
    }
    if (X >= N) {
        xsDesc =
            "<b>性导向 (X)</b> 性导向的角色认为vore是一种诱惑，充满了快感的。通常来说，性导向的角色在被带入vore的情境中时会焦头烂额，因为他们可能会被引起冲动。性导向地捕食者会寻找能够满足他们性冲动，以及其他任何的动机的猎物，而这种动机包含饥饿、控制欲，以及（或者）在他们身体上增加一点食物的重量。性导向的猎物也因为类似的原因享受着，满足于变成捕食者的食物，玩物，或者身体需要的能量，不管他们是自愿的还是非自愿的。 \n";
    } else {
        xsDesc =
            "<b>非性导向的 (N)</b> 非性导向的角色将vore看作纯粹的乐趣，满足，或者纯粹的饥饿。他们不会把vore和性元素连接在一起——这是性导向角色一般的特质。尽管如此，这也并不意味着他们不会在vore的经历中获得一些快感。非性导向的捕食者可以有非常多的动机，这依赖于他们本身的个人特质，但是通常来说，他们只是把vore当作获取食物，满足感，绑定关系，或者仅仅是乐趣的方式，而不是一种性欲。非性导向的猎物同样地享受着这种经历，不过并不把vore当作性癖——可能是因为他们只是不幸的非自愿猎物，一种足够纯粹的猎物，不会把被吞食当作一种恶趣味。 \n";
    }

    textarea3.innerHTML =
        isDesc +
        '<br /> <br />' +
        veDesc +
        '<br /> <br />' +
        apDesc +
        '<br /> <br />' +
        xsDesc;

    // PERCENTAGE CALCULATOR

    // Hard code max values for all (30) strdis+stragr

    let isTotal = 30;
    let veTotal = 30;
    let apTotal = 30;
    let xnTotal = 30;

    let iPerc = (I / isTotal) * 100;
    let sPerc = (S / isTotal) * 100;
    let vPerc = (V / veTotal) * 100;
    let ePerc = (E / veTotal) * 100;
    let aPerc = (A / apTotal) * 100;
    let pPerc = (P / apTotal) * 100;
    let xPerc = (X / xnTotal) * 100;
    let nPerc = (N / xnTotal) * 100;

    // STRDIS=3 to Opposite, DIS=1 to Opposite, NEU=0,  AGR=2, STRAGR=3

    scoreI.innerText = Math.round(iPerc) + '%';
    scoreS.innerText = Math.round(sPerc) + '%';
    scoreV.innerText = Math.round(vPerc) + '%';
    scoreE.innerText = Math.round(ePerc) + '%';
    scoreA.innerText = Math.round(aPerc) + '%';
    scoreP.innerText = Math.round(pPerc) + '%';
    scoreX.innerText = Math.round(xPerc) + '%';
    scoreN.innerText = Math.round(nPerc) + '%';
}

// Initialisation
const hashRegex = /^#([IS][VE][AP][XN])(?:-([WU]))?\/?(?:\/(\d{1,3}(?:-(\d{1,3})){7}))?$/i;

function processHash() {
    if (window.location.hash == '' || window.location.hash == '#') {
        resetTest();
        resetScores();
        hideMenu('results-menu');
    } else {
        const m = hashRegex.exec(window.location.hash);
        if (m !== null) {
            switch ((m[2] ?? '').toUpperCase()) {
                case 'W':
                    //title.innerText = title.innerText + ' - Willing Prey';
                    testType = wpreyStatements;
                    document.body.className = 'wpreybody';
                    changeTheme("var(--wPrey)");
                    break;
                case 'U':
                    //title.innerText = title.innerText + ' - Unwilling Prey';
                    testType = upreyStatements;
                    document.body.className = 'upreybody';
                    changeTheme("var(--uPrey)");
                    break;
                default:
                    //title.innerText = title.innerText + ' - Predator';
                    testType = predStatements;
                    document.body.className = 'predbody';
                    changeTheme("var(--pred)");
                    break;
            }
            if (m[3]) {
                const tokens = m[3].split('-');
                I = parseInt(tokens[0]);
                S = parseInt(tokens[1]);
                V = parseInt(tokens[2]);
                E = parseInt(tokens[3]);
                A = parseInt(tokens[4]);
                P = parseInt(tokens[5]);
                X = parseInt(tokens[6]);
                N = parseInt(tokens[7]);
            } else {
                const type = m[1].toUpperCase();
                if (type[0] == 'I') I = 30; else S = 30;
                if (type[1] == 'V') V = 30; else E = 30;
                if (type[2] == 'A') A = 30; else P = 30;
                if (type[3] == 'X') X = 30; else N = 30;
            }
            hideMenu('main-menu');
            finalResult();
        }
    }
}

window.addEventListener('hashchange', processHash);
processHash();
