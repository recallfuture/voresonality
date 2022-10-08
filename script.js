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
    if (confirm("确定重置并回到首页吗？保存的所有数据将被清空！")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
    else { }

});
resetbtn2.addEventListener('click', function () {
    if (confirm("确定重置并回到首页吗？保存的所有数据将被清空！")) {
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
async function sentToClipboard() {
    // Text to copy
    var text = window.location.toString();
    // Sending it to the clipboard
    await navigator.clipboard.writeText(text);
    alert("已将结果复制到剪贴板。")
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
        typeDesc = typeDesc + '[I]ndividual（自我） / ';
    } else {
        type = type + 'S';
        typeDesc = typeDesc + '[S]hared（互利） / ';
    }
    if (V >= E) {
        type = type + 'V';
        typeDesc = typeDesc + '[V]isceral（本能） / ';
    } else {
        type = type + 'E';
        typeDesc = typeDesc + '[E]motional（情感） / ';
    }
    if (A >= P) {
        type = type + 'A';
        typeDesc = typeDesc + '[A]ctive（主动） / ';
    } else {
        type = type + 'P';
        typeDesc = typeDesc + '[P]assive（被动） / ';
    }
    if (X >= N) {
        type = type + 'X';
        typeDesc = typeDesc + 'Se[X]ual（性欲）';
    } else {
        type = type + 'N';
        typeDesc = typeDesc + 'Se[N]sual（感官）';
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
                '所谓的顶级捕食者。IVAN捕食者将填饱肚子视作首要任务，而这个世界上有许多美味的猎物能够满足这个要求。它们会积极地狩猎，追捕猎物的唯一目的就是满足它们那无法满足的饥饿感。猎物们也许会踢打和挣扎，但是作为食物链的顶端，它们总会是最后的赢家。它们通常不会在意猎物的感受。它们可以吃掉任何人，只要猎物是美味的，它们都会一视同仁地享受。 \n';
            break;
        case 'IVAX':
            title2.innerText = '饕餮';
            textareaheader.innerText =
                "“嗯~随便你怎么挣扎，这里可没有出去的路哦。”";
            textarea2.innerText =
                "食欲是一回事，肉欲又是另一回事了。当一些倒霉蛋被吞掉、从喉咙中滑下时，它们不禁会为它的肉体做出贡献，还会为它带来一个充满激情的有趣夜晚。IVAX捕食者陶醉于蠕动的猎物，尤其是一个懂得如何正确地推拿每一个正确方位的猎物。 \n";
            break;
        case 'IVPN':
            title2.innerText = '蜘蛛';
            textareaheader.innerText =
                "“你知道的，如果你承认自己也想要这样，事情会容易得多~”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IVPN不会主动寻找猎物。它们知道只要自己有足够耐心，食物就会主动送到面前。这种狩猎策略通常会让它们感到饥饿，所以一旦猎物送上门，它们就会毫不犹豫地吃掉它们，享受这顿来之不易的大餐。所谓“不经一番寒彻骨，怎得梅花扑鼻香”……嗯？不是这么用的吗？ \n";
            break;
        case 'IVPX':
            title2.innerText = '塞壬';
            textareaheader.innerText =
                "“来吧……难道你不想成为这个美丽形体的一部分吗？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "和IVPN不同，IVPX捕食者会在吃掉猎物之前考虑它们的长相。它们喜欢可爱或者有魅力的猎物，这能在说不清的方面上让猎物显得更加美味。另一方面，它们可能只是想要最优质的猎物进入自己的身体，因为它们知道在猎物被消化之后，它们身体的曲线将会变得更加引人注目。 \n";
            break;
        case 'IEAN':
            title2.innerText = '求索者';
            textareaheader.innerText =
                "“随你怎么挣扎吧，这改变不了我们之间的关系。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEAN捕食者有它们自己的捕食它人的理由——不管是用伤害过自己的人来填饱肚子，还是这样能让它们感觉到自己高人一等。它们将“吃”视为一种达成情感目的的手段，这不仅能够满足它们的饥饿感，还能满足它们情感上的需求。   \n";
            break;
        case 'IEAX':
            title2.innerText = '饿霸';
            textareaheader.innerText =
                "“让我康康你的触发开关是什么，好让你一直动下去。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEAX捕食者总是知道该说什么来让自己的猎物蠕动。它们在奚落和嘲弄肚子里的猎物以让它们蠕动的过程中找到乐趣。它们以吞食猎物作为消遣，尤其喜欢能消耗大量精力在它们胃里蠕动的猎物。它们有时会厌倦自愿或被动的猎物，但弄清楚怎样才能让它们有所反应也是一项有趣的挑战。不过，IEAX捕食者并不一定是恶意的，它们可能只是喜欢和猎物调情，在吃掉猎物的时候会戏弄它们。 \n';
            break;
        case 'IEPN':
            title2.innerText = '捕手';
            textareaheader.innerText =
                "“我们都知道我想要这个……那你呢？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEPN捕食者喜欢诱骗它们的猎物产生一种虚假的安全感，它们了解这些，经常暗示它们的命运，但从不会直接说出来。 在某种程度上，IEPN的猎物知道它们只是对方的一顿美餐，但IEPN的自然魅力鼓励着它们继续保持朋友关系。IEPN捕食者吞食猎物是为了和猎物之间保持情感联系的欲望，以及这个过程带来的感觉。它们可以是热情的捕食者，同时也可以是精明的骗子。 ";
            break;
        case 'IEPX':
            title2.innerText = '妖妇';
            textareaheader.innerText =
                "“以我为始，以我为终。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEPX捕食者经常出现在公共场合，等待猎物注意到它们。它们会眨眨眼，然后从人群中溜走，将目标引入一个安静的区域，在那里它们可以从身体上以及情感上更好地了解彼此。IEPN捕食者喜欢和猎物先玩玩游戏，引导它们进入一个充满激情之夜（至少是对它们来说），并在猎物最意想不到的时候吞食它们。它们诱人的本性让大多数人都难以抗拒，尽管它们总倾向于被动地等待猎物找上自己。 \n';
            break;
        case 'SVAN':
            title2.innerText = '伙伴';
            textareaheader.innerText = "“朋友，好吃！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAN是比起IVAN更友好的捕食者。它们通常会寻找有主动意愿猎物来满足自己的胃口，并且尽量做到让双方都能愉快地体验整个过程。尽管它们吞食主要还是为了满足自己的饥饿感，但它们共享的天性确保了它们的暴食永远不会优先于猎物的舒适感。 \n';
            break;
        case 'SVAX':
            title2.innerText = '东道主';
            textareaheader.innerText = "“希望你会对此感到舒适。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX捕食者喜欢在主线开始之前先让猎物感到舒服，清楚细致地描述接下来会在它们身上发生的事情。它们会解释自己正饥肠辘辘并且渴望被填饱，以及这对自己以及猎物来说是件多好的事。它们的热情富有感染力，甚至能够说服最不情愿的猎物。 它们可以使用技能来欺骗猎物，但它们中的大部分还是更希望自己的猎物能对结局满意。 \n';
            break;
        case 'SVPN':
            title2.innerText = '动心者';
            textareaheader.innerText =
                "“真的很抱歉！但是我实在是太饿了……”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVPN捕食者一直在和它们的冲动作斗争，它们有很多的猎物朋友，但当胃开始咆哮时，它们所能想到的就是吃掉它们。尽管屈从本能并开始吞食大量猎物这种事十分美好，但它们一直在努力忽视这种想法。找到一个愿意被捕食的同伴对于SVPN捕食者来说是一种莫大的解脱——如果它们能说服自己只吃一个的话。 \n';
            break;
        case 'SVPX':
            title2.innerText = '贪色者';
            textareaheader.innerText =
                "“涩涩是很棒啦，不过你有试过被吞掉吗？啊呜！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '狂野的激情之夜通常以SVPX的饱腹而告终。它们会在某一刻迷失自我，想要更深入地去感受它们的伴侣。它们可能会用vore的方式来让自己或者伴侣达到高潮，或者作为共度时光后拥抱它们的一种方式。无论如何，SVPX捕食者是那种有着旺盛食欲的恋人。 \n';
            break;
        case 'SEAN':
            title2.innerText = '守护者';
            textareaheader.innerText = "“征服我的心的方法就是征服我的胃！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SEAN捕食者喜欢和它们的朋友保持亲密的关系，而要这样的话还有什么方法能比“负距离接触”更好呢？这种捕食者喜欢和胃里的猎物共度美好时光，即使是在日常生活中也经常会把它们装在肚子里很长时间。SEAN捕食者可能是endosoma的候选者，因为它们喜欢把猎物放在肚子里，以获得情感上的安慰。 \n';
            break;
        case 'SEAX':
            title2.innerText = '收藏家';
            textareaheader.innerText =
                "“我希望我们能一直在一起，永不分开……”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEAX捕食者在猎物方面非常注重质量。它们是社交动物，喜欢结识任何能吸引它们眼球的有魅力的人。它们鼓励猎物探索自己的身体，并就它们最终要去的地方发表意见——尽管它们可能最后要去的会是更“有趣”的地方。它们“共享”和“情绪化”的特质使得它们在积极地“狩猎”时对于自愿的猎物会有强烈的偏好。在非致命的场景中，这些捕食者会不断地提醒猎物对自己的身体做出了多少贡献，经常会摆各种姿势或者炫耀，并会用朋友的名字和自己的脂肪交谈。   \n";
            break;
        case 'SEPN':
            title2.innerText = '养育者';
            textareaheader.innerText =
                "“怎样？舒服吗？想出来的时候跟我说一声噢。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEPN捕食者喜欢让它们的猎物感到温暖和舒适，经常在吞食之前以及之后用慰藉的话来鼓励它们。它们倾向于保护猎物的安全，不愿意做任何会对猎物造成伤害的事情（例如消化）。一些SEPN捕食者甚至根本不认为自己是捕食者，只有在猎物靠近它们并且寻求体验时才会选择进食。 \n";
            break;
        case 'SEPX':
            title2.innerText = '浪漫主义者';
            textareaheader.innerText =
                "“我希望在我的体内感受你，但前提是你愿意。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "浪漫主义者，恋人，激情的追求者。SEPX比任何人都更了解vore的亲密本质。这是两人之前热情的展现，它们都想要同样的东西：一种无与伦比的亲密。SEPX不会主动寻找猎物，而是为它们提供自由探索自己身体的机会。一旦进入到它们体内，SEPX就会在它们自己以及猎物的兴奋中获得巨大的性快感。它们通常选择在完成之后把猎物吐出来，或者至少找到复活的方法，因为SEPX捕食者和它们吃掉的人建立了紧密的联系，不希望它们因此受到伤害。 \n";
            break;

        /* WILLING PREY DESCRIPTIONS */

        case 'IVAN-W':
            title2.innerText = '点心';
            textareaheader.innerText =
                "“你还在等什么呢？张开嘴我好跳进去啊！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "说不好从何时起，你产生了一种想被吃掉的奇怪欲望。也许是被喉咙严丝合缝地地包住，胃低沉地咕噜作响，亦或是想象自己悬在某个幸运的食肉动物的腰间，但你知道自己注定是食物。你寻找食肉动物，并试图主动被它们吃掉，以至于大多数人都知道你是一个随时都准备被吃掉的自愿的小点心。 \n";
            break;
        case 'IVAX-W':
            title2.innerText = '冒险家';
            textareaheader.innerText =
                "“你的舌头看起来又湿又黏，我已经等不及与它亲热亲热~”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "它们会积极追求它们被吞下的梦想，在每个自己见到的捕食者身上将幻想变为现实。有些人对这类猎物的饥渴感到吃惊，但它们被吞食后在捕食者们腹中的举动可以消除任何疑虑。对它们来说，被吃掉是一种癖好，而它们会不惜一切去体验它。 \n";
            break;
        case 'IVPN-W':
            title2.innerText = '等待者';
            textareaheader.innerText =
                "“我不知道他们怎么花了这么长时间，难道我还不够美味吗？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "它们对等待并不陌生，经常听到其他猎物谈论它们曾经遇到过的猎手。虽然它们很想感受胃袋的温暖拥抱，但消极的天性会阻止它们接近猎手。相反，它们只会日复一日地等待，知道迟早会有掠食者把它们追上并吞食掉。 \n";
            break;
        case 'IVPX-W':
            title2.innerText = '幻想家';
            textareaheader.innerText = "“啊…什…什么？抱歉啊，我走神儿了。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "你几乎时时刻刻处在幻想自己是猎物的状态。捕食者呼出的热气、当你顺着它们的喉咙滑下时，夹在“”你的双腿间的温暖舌头……这些白日梦让你喜不自胜，但你下不了奉行这些幻想的决心。不过，如果一名猎手将你逼入绝境或提出报酬的话…… \n";
            break;
        case 'IEAN-W':
            title2.innerText = '爱慕者';
            textareaheader.innerText =
                "“太舒服了，让我一直在里面吧。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "与胃有关的事物能让你心神宁静。你从未体验过像拥抱肉壁那样的安逸。IEAN-W型猎物寻求捕食者是为从中获得情感上的安慰，或者知道它们正在实现当猎物的目标。 \n";
            break;
        case 'IEAX-W':
            title2.innerText = '探索者';
            textareaheader.innerText = "“谁的肚子又在咕咕叫了~？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '兴趣多而杂乱的猎物。它们享受vore的情感要素，在肠胃的刺激中寻求性快感。然而，它们的“个人”（I）倾向着它们不会囿于一位捕食者。它们的冒险在不断的迁移中度过，寻找着新的喉咙并钻入胃中进行一番探索。IEAX-W猎物的经历足以讲出无数的故事。 \n';
            break;
        case 'IEPN-W':
            title2.innerText = '局外人';
            textareaheader.innerText =
                "“又是一个只会把你认作食物、毫无诚意的捕食者…唉，我还是坐下来歇会儿吧。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "局外人型人格容易与IVPX白日梦型人格混淆，尽管任何IEPN猎物都会表明它们的欲望不仅仅是“被吃掉”。当捕食者从外面嘲弄它们时，它们可能会“孤芳自赏”，只幻想着周身被胃环抱的极致感觉，但对于吞噬它们的强大生物而言，它们只不过是食物。IEPN-W通常不在乎捕食者是谁，只是想着有一天，不知怎么地，一个猎手会接近它们，让它们感到自己受到了特殊的待遇，并将它们一口吞下。\n";
            break;

        /* Descriptions and Flavour Text To Be Added */

        case 'IEPX-W':
            title2.innerText = '含羞草';
            textareaheader.innerText = "“卧-卧槽，喉咙来了！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEPX很容易慌张，一看到捕食者就脸红。它们的被动（P）特质使它们通常天性温驯，将它们置于任何能用嘲弄和挑逗使它们性奋的捕食者的奇想之下。它们喜欢性感撩人的捕食者，特别是能让它们诉诸情感的那类。 \n';
            break;
        case 'SVAN-W':
            title2.innerText = '忠臣';
            textareaheader.innerText =
                "“除了你，我真是找不到合适的人选把我吃掉了。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "它们可能把自己看作食物，但并不像IVAN那样寻找任何猎手来满足这种欲望，而是将自己留给朋友或者真正需要它们的猎手。当涉及到吞食时，它们与捕食者之间的关系仍然是一种交换（例如为了吃掉它们获取快乐而被吃掉的经历），SVAN猎物很可能会很快结交猎手朋友，当它们产生想钻入胃中的冲动时，可以拜托这些朋友。 \n";
            break;
        case 'SVAX-W':
            title2.innerText = '风味佳肴';
            textareaheader.innerText =
                "“附近好像有什么东西闻起来很诱人，你也闻到了吧？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '它们和与之对应的SVAN-尽心型人格一样，遵循着与捕食者关系密切的原则。然而这种情况却有着古怪的走向，这种猎物希望尽可能吸引潜在的捕食者，无论是身着具有挑逗意味的服饰，还是在自己身上淋满调味料，或者其他任何可能让潜在的捕食者把自己看作美味可口的食物的手段。它们积极地追求猎手们以获得下流的邂逅，体验着vore的刺激，同时也得到了吃它们的猎手的赞美。 \n';
            break;
        case 'SVPN-W':
            title2.innerText = '你的食物朋友';
            textareaheader.innerText =
                "“你想吃就吃掉我吧，我不会介意的。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "虽然SVPN-W猎物并不积极寻找扮演食物的机会，但它们可能会抱着“其中一个捕食者最终会决定吃掉它们”这样的心思认识几个捕食者，而不是与陌生人碰运气。如果这类猎物能成为朋友的食物，那么它们会很满意。但通常它们会做一番心理斗争，自己是否有勇气向朋友坦白自己被吃掉的欲望，因为一旦坦诚到某种程度，它们的朋友可能就觉得自己不会感兴趣了， \n";
            break;
        case 'SVPX-W':
            title2.innerText = '讨好者';
            textareaheader.innerText =
                "“呼嗯…求求你吃掉我吧，我现在欲火中烧。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '对SVPX-W来说，被吃掉是涩涩的最高峰。它们寻求与那些它们觉得有吸引力的捕食者建立联系，希望被吞食并成为它们身体的一部分，或者只是在它们性感的内脏中使其隆起一段时间。然而，不像与它们相对应的SVAX型猎物，SVPX-W更希望大部分掌控和吸收它们的事情由捕食者一方来做，而它们则完全服从猎手并享受它们的旅程。不像SEPX-W，SVPX专注于与捕食者在最激烈的时刻产生的原始激情，如果它们找到适合与其配合的捕食者类型，就可以在很有可能变幻莫测的反馈回路中取悦捕食者，从而获得乐趣。 \n';
            break;
        case 'SEAN-W':
            title2.innerText = '渴望者';
            textareaheader.innerText =
                "“我们关系这么好，我有一个办法让我们更加如胶似漆。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SEAN-W猎物通常与它们对应的SEAN型捕食者有着相似的观点，它们会花很多时间在捕食者体内取乐。这种猎物会积极促进吞食的情况发生，好在捕食者腹中给它们揉揉肚子，以让它们能一直在里面。它们也可能希望与捕食者融为一体，觉得随着猎物成为更大整体的一部分，双方都将受益。无论如何，它们都是合群的家伙，能够与其他类型的捕食者形成更深的契合，但可能会发现感官（N）的特征过于强烈。 \n';
            break;
        case 'SEAX-W':
            title2.innerText = '调情者';
            textareaheader.innerText =
                "“我真的很喜欢和你聊天，但我们的交谈如果隔着一层肉壁，会变得更上一层楼~”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "它们很清楚它们的兴趣，并乐于找到与之般配的猎手。它们怂恿捕食者，并以性挑逗和性嘲弄回击，也许还会刺激捕食者，让它们变得足够兴奋以在充满欲望的状态下吃掉猎物。如果捕食者不喜欢或报以取笑，那它们很可能不希望被这样的捕食者吃掉，因为除非双方都能开心，否则vore就没有意思了。它们也可能寻求成为有吸引力的捕食者的一部分，或者也许是为了帮助捕食者更具吸引力，因为成为捕食者性特征的一部分或者让捕食者们变得更漂亮它们可能会感觉更好。 \n";
            break;
        case 'SEPN-W':
            title2.innerText = '仆人';
            textareaheader.innerText =
                "“我等不及在你的里面，或者成为你的一部分了….”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEPN-W是一种追求喂养捕食者朋友的、一心一意的猎物，它们也是那种会在将自己作为食物提供给捕食者时找到乐趣的家伙。它们通常给予捕食者完全的控制权，无论它们（在捕食者腹中）待上多久，它们都会满足于不插手任何事，在朋友的身体深处放松。它们可能会把自己视为朋友的个人零食或咀嚼玩具，想玩的时候拿起来用就好。它们有时会被误认为SVPX的“恋人”，但它们的兴趣更多地来自于它们的肉欲，对于这些敏感的人来说，被吃掉的感觉在性兴奋感之上。 \n";
            break;
        case 'SEPX-W':
            title2.innerText = '信徒';
            textareaheader.innerText = "“听你发落。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '它们在为捕食者服务时感到舒适，也会在被捕食者控制和使用时感到兴奋。它们可能将自己视为一个可食用的性玩具，无论何时都可以来取悦它们的爱人、主人或朋友。它们愿意把自己交给它们的爱人以用来满足它们的性欲，包括但不限于各种层面的用。然而，作为情绪型猎物，它们渴望得到捕食者的嘲笑和赞美，以及建立长期联系。这使得它们可以选择的捕食者比SVPX同伴更少，但关系更亲密。 \n';
            break;

        /* UNWILLING PREY DESCRIPTIONS */

        case 'IVAN-U':
            title2.innerText = '挑战者';
            textareaheader.innerText = "“我不会不战而降的！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "你在无数捕食者的口腔里身经百战，应该知道如何摆脱困境。尽管有多次逃脱经验，掠食者仍然认为它们可以吃掉你。也许一些捕食者就是想挑战一下制服如此活跃的猎物？不管怎么说，那些想要被吃掉的人会让你百思不得其解。你永远不会允许自己成为猎物，如果哪些捕食者非要吃你，你一定会从它们那里挣脱出来。\n";
            break;
        case 'IVAX-U':
            title2.innerText = '回避者';
            textareaheader.innerText =
                "“啊…什…什么？我当然不喜欢！放开我！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "一开始你奋力反抗，但一旦被吞进肚，你的心开始以一种最奇特的方式怦怦乱跳、悸动起来……你兴奋了吗？为什么在这种时候你会感到兴奋？IVAX-U在它们的处境中经历了一些性兴奋，但拒绝承认。与其只因为欲火中烧就停下来，你还不如继续挣扎。 \n";
            break;
        case 'IVPN-U':
            title2.innerText = '宿命论者';
            textareaheader.innerText = "“呃，好吧…”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                '你挣扎了一段时间，但决定停止。也许你已经放弃了，也许你只是在保存你的力量。在它们的经验体系下，IVPN总类（IVPN捕食者、IVPN-W、IVPN-U）都知道自己的本性——它们被捕食者吃掉的几率很高，所以当吞吃时分到来时，它们会将战斗降至最低程度。被动（P）倾向的猎物很少能在胃壁上坚持（抵抗）很长时间，尽管这种策略可能会让你的捕食者厌烦，让你离开…只能希望如此了。 \n';
            break;
        case 'IVPX-U':
            title2.innerText = '“王境泽型”猎物';
            textareaheader.innerText =
                "“你真习惯了之后好像还行诶…”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IVPX-U是一种复杂的猎物。它们知道被吃掉有多危险，捕食者的内脏可能有多恶心，但一旦遭遇这种命运后，它们就会屈服。一旦捕食者开始吞食它们，它们会发现自己受到刺激；用舌头品尝它们，身体会产生神奇的性冲动。也许从这个意义上说，它们并不像最初自己想象的那样不情愿。  \n";
            break;
        case 'IEAN-U':
            title2.innerText = '懊悔者';
            textareaheader.innerText = "“你不能这样对我啊！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'IEAN-U是忧郁的猎物。当IEAN的自愿型猎物（IEAN-W）和IEAN掠食者在吞食活动中找到各自的目标和意义时，IEAN-U只会为它们所有未完成的事情感到遗憾。它们会为自由而战，为完成尚未了结的事务而战。它们的E型（情感）特征通常是它们武器库中最强大的武器，可以说服一些E型捕食者，尤其是SE型（互利-情感导向）捕食者放它们走。 \n';
            break;
        case 'IEAX-U':
            title2.innerText = '心神不定者';
            textareaheader.innerText = "“啊~~不要啊，放我走！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEAX-U是容易慌乱的猎物。虽然它们的独立（I）倾向意味着它们会尽量避免被吃掉，但当捕食者在它们面前张开嘴巴时，它们会忍不住多看一眼。它们通过坚定的挣扎和抗议自己不是猎物来掩盖自己的兴奋，常常诱使捕食者更加起劲儿地戏弄它们。一个想要从IEAX-U猎物身上得到最大好处的捕食者应该专注于取笑它们的命运，告诉它们，它们的味道有多好，最重要的是，嘲笑IEAX-U猎物实际上自己有多享受。这三种策略的结合可以保证它们的猎物整晚都在坐卧不宁。 \n";
            break;
        case 'IEPN-U':
            title2.innerText = '悲观主义者';
            textareaheader.innerText = "“真的无路可逃了，不是么？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "当掠食者看到它们的那一刻，所有的希望都破灭了。随着吞咽的“咕嘟”一声，以及捕食者的一个饱嗝，你的身体已被困住，所有希望也荡然无存，现在你完全变成了他的一餐。IEPN-U发现自己被吞食时毫无控制权，经常就立即屈服于自己的命运。IVPN-U的担忧主要来自于自己可能被消化，而IEPN-U更担心人们一旦发现自己被消化了，会是什么反应。它们是被动（P）倾向的猎物，通常试过一次逃跑就放弃了，或者轻轻一拍就很容易让它们噤声。 \n";
            break;

        case 'IEPX-U':
            title2.innerText = '优柔寡断者';
            textareaheader.innerText =
                "“这其实挺性感的，呃，只要我不待太久……”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "IEPX-U经常被混淆为IEPX的自愿型分支（IEPX-W），尽管它们更有可能否认自己的小秘密：被吃掉的欲望。它们有些可能有很少、或根本没有被吃掉的欲望，但可能太容易被性唤起，类似的性戏弄也可能会压倒它们能够提出的任何抵抗。一旦捕食者的身体开始消化它们，或者它们被无限期地困住，IEPX可能会后悔自己的决定。或者，它们以后可能会变成自愿性猎物，尤其是如果它们能活着再看到这种行为的话。 \n";
            break;
        case 'SVAN-U':
            title2.innerText = '投喂者';
            textareaheader.innerText =
                "“啊哈，我给你准备了另一只猎物！只要不吃我，什么都好说~哈哈…”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "典型的SVAN-U型猎物有和它们泡在一块儿的捕食者朋友。它们通过与捕食者交往，让它们相信自己是更好的伴侣，而不是一顿饭，从而游走于被吃掉的边界。它们经常成为投喂者，或为捕食者寻找猎物，以避免自己成为猎物，但它们始终意识得到，每当它们听到下一个饿得咕咕叫的胃，里面可能就得是自己了。当被吞吃的命运最终来临，它们往往是积极的抵抗者。 \n";
            break;
        case 'SVAX-U':
            title2.innerText = '窥淫者';
            textareaheader.innerText = "“很高兴是它们而不是我…嗯。真好。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                'SVAX-U型猎物通常是旁观者，它们在观察吞食行为（vore）时会发现自己奇怪地兴奋起来，但又害怕成为猎物。它们可能会投喂自己的捕食者朋友，关注捕食者捕食猎物的社交媒体趋势，或者只是在别人被吞食时停下来看一看。它们的主动（A）倾向鼓励它们越来越接近实际行动，直到最后它们有点太接近了。在这个时候，它们的性冲动变得与自己不共戴天，只留得满脑子的回味与不解，是哪个时候自己已回不了头。 \n';
            break;
        case 'SVPN-U':
            title2.innerText = '美食家';
            textareaheader.innerText =
                "“希望你至少享受这一餐，即使这里很恶心。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SVPN-U并不想被吃掉，但如果靠近它们，它们很可能会屈服，让捕食者随心所欲。然而，与IVPN不同的是，这种猎物可能会确保它们的捕食者至少喜欢它们，因为如果它们必须是食物，至少应该是一顿难忘的晚餐。尽管不会承认，但它们确实喜欢捕食者称赞自己的味道，或它们吃完后的饱腹感。 \n";
            break;
        case 'SVPX-U':
            title2.innerText = '给予者';
            textareaheader.innerText =
                "“嗯…如果真的被吃掉了，我不妨试着享受一下。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SVPX-U在几乎所有方面都与SVPN相似，尽管它们与“被吞食”之间的关系，会因它们对结果不同的反应而有所出入。SVPN希望它们至少是一顿饱腹或美味的大餐，而SVPX则希望在胃里找到一些乐趣。当SVPX-U在捕食者的胃中，捕食者完全控制着它们，使得一种性冲动被奇怪地激起。它们在捕食者的胃里得以“隐身”时，也会（因性冲动）采取实际行动。 \n";
            break;
        case 'SEAN-U':
            title2.innerText = '蒙羞者';
            textareaheader.innerText = "“你…你怎么敢！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEAN-U的猎物发现它们被吃掉后，最大的情绪反应就是羞辱。它们的互利（S）导向意味着很容易被捕食者戏弄。它们的情感（E）导向会让它们更关注捕食者说的话，而不是周围的胃壁。戏弄会让它们迅速、疯狂地逃跑，同时它们的自尊心却依然完好无损。 \n ";
            break;
        case 'SEAX-U':
            title2.innerText = '深柜';
            textareaheader.innerText =
                "“不…我没在脸红，只是这里真的太热了！”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEAX-U型猎物与相对应的SEAN-U型猎物很相似；容易受到捕食者的戏弄和刺激，尤其是与它们很亲近的捕食者。然而，与专注于感觉的SEAN不同，SEAX-U在捕食者的戏弄中能够找到一些性冲动，通常导致它们坐立不安。这种坐立不安通常不是出于羞辱，更多是为了试图隐藏它们在捕食者的控制下的性兴奋。 \n ";
            break;
        case 'SEPN-U':
            title2.innerText = '实心眼儿';
            textareaheader.innerText =
                "“呃，好吧…但我一叫你，你就放我出去，好吗？”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "SEPN-U是这样的一种猎物：它们本身不情愿，但可以被信任的人哄骗，从而进入它们的腹内。它们可能不想要，但如果它们的伴侣真的想要，它们就会屈服，给伴侣想要的享受。大多数人都希望从捕食者那里得到安全的保证，但尽管SEPN-U渴望掌控局面，如果捕食者开始表现得更强势，它们往往会陷入被动。这些猎物最终可以在合适的时间和捕食者的帮助下变成自愿型（Willing），尽管它们需要在操纵型（IE）捕食者周围长个心眼儿！ \n";
            break;
        case 'SEPX-U':
            title2.innerText = '玩具';
            textareaheader.innerText =
                "“只要你喜欢，我想我可以的。”";
            textarea.innerText = typeDesc;
            textarea2.innerText =
                "与SEPN-U很类似, SEPX-U是一个有点不情愿的玩具。它们在被吃掉的过程中不会像它们的捕食者伴侣那样感到快乐，但它们与捕食者的关系足够重要，以至于它们常常可以绕过自己的不情愿，来满足伴侣的欲望。这种来自SE（互利-情感）特征的与捕食者的关系水平，加上来自P特征的被动方式，意味着它们经常可以在被吃掉的支配方面找到性唤醒，尽管就本人而言，它们仍然不会认为自己喜欢这种事。 \n";
            break;
    }

    // Build the Traits Description

    let isDesc = '';
    let veDesc = '';
    let apDesc = '';
    let xsDesc = '';

    if (I >= S) {
        isDesc =
            "<b>自我 (I)</b> 自我导向（自我I型）的角色通常不会花太多心思在对方身上，不会考虑对方的感受，同时也不会花很多精力去让对方体验到舒适的过程。自我的角色不一定讨厌拉长进食的过程以在事先获得一点点的满足，但是到最后，它们都会沉迷于这种结果以取悦自己。如果是非自愿型猎物，自我导向就会表现为它们可能不会在意捕食者的意愿，它们只想逃离以不被吞掉。如果是自愿型猎物，自我导向将会表现为它们会设法满足自己的幻想，而不顾捕食者的态度。 \n";
    } else {
        isDesc =
            "<b>互利 (S)</b> 互利导向（互利S型）的角色只有在对方也得到满足的情况下才能真正地满足自己。即使它们会想办法满足自己的要求，它们也会同时尊重对方的意愿。互利导向的捕食者更喜欢吞下自愿的猎物，或者也有可能哄骗猎物把它们的食道当作滑梯。如果它们吞下了一个非自愿的猎物（很有可能出于纯粹的需求），它们会感到懊悔，因为它们实际上看重的是猎物的情绪。互利导向的猎物通常都是自愿的，并且尽可能地在这个过程中取悦它们的捕食者。而具有互利特质的非自愿猎物通常都是勉强自己——它们不想作为食物，但是它们可能还是会接受这个过程。 \n";
    }
    if (V >= E) {
        veDesc =
            '<b>本能 (V)</b> 生理导向（本能V型）的角色这么做的原因只是它们需要这么做，或者是这么做有道理。生理导向型的捕食者通常是被它们原始的饥饿驱使，或者是它们生理上需要做出这样的行动，也可能是简单地需要支撑生命活动的能量。生理导向型的自愿猎物，通常也是这样——它们想要被吞食，因为这使它们感觉良好，它们在生理上满足于这种体验。生理导向型的非自愿猎物完全是因为它们想要生存而不是被消化，或者是对自己被困囿于捕食者身体内部的疼痛和不舒适的环境的恐惧。 \n';
    } else {
        veDesc =
            '<b>情感 (E)</b> 心理导向（情感E型）的角色倾向于关注vore这整个过程背后隐含的意义。心理导向型的捕食者享受和猎物之间的关系，有可能是对方的一个情感依赖者，或者是统治者，也有可能因为它们享受于把对方裹在腹中，甚至是将对方转化为自己身体的一部分的这种感觉。它们可能更享受于猎物的祈求和挣扎，而生理导向型的捕食者会觉得猎物的动静过于吵闹。心理导向型的自愿猎物也会有类似的表现，沉迷于被吞进对方腹中的感觉，因为这让它们有了被征服的感觉，或者是能和捕食者关系近一些，或者关系很近，例如：被消化。而心理导向型的非自愿猎物也有一些重要的原因想要逃离——不是因为对这种感觉恐惧，而是因为这对它们来说是被征服——甚至有可能失去生命。 \n';
    }
    if (A >= P) {
        apDesc =
            "<b>主动 (A)</b> 主动导向（主动A型）的角色会用自己的办法让vore的行为真实发生，从而达到它们自己的想法。这种特质在捕食者身上就很重要——主动的捕食者有规律地狩猎，或者普遍在寻求能够吞下别人的机会。一旦它们找到了它们中意的猎物，主动的捕食者通常会想办法吞下它们，并且有可能会施加一点强制力在猎物身上以达到它们想要的目标。主动的猎物当然会明确拒绝，并且挣扎。或者，对于自愿猎物，它们可能会有意图地寻找或者鼓励捕食者将它们当作一顿美餐。 \n";
    } else {
        apDesc =
            "<b>被动 (P)</b> 被动导向（被动P型）的角色通常被事情的发展所裹挟着，一般是“自己正处于某种情况”而不是“自己创造了某种情况”。被动的捕食者倾向于等待，并且观察潜在的猎物，而不是直接抓一只——有可能是想出一个非常详细的计划让猎物自投罗网，或者是用自己诱人的身体引诱猎物靠近。被动的捕食者也经常不把自己看作捕食者，或者在猎物围绕着自己的时候也不为所动（当然在诱惑太强烈的时候也会控制不了自己）。被动的猎物，在当捕食者抓住自己的时候很自然地就会贡献自己——当然会有很多原因，有可能是绝望地服从，也有可能是快感。有被动特质的自愿猎物乐意于满足捕食者的奇思妙想，有可能作为食物，或者是“玩具“的身份。而被动特质的非自愿猎物自然会看起来更加怯懦——如果它们觉得没有希望，甚至会放弃挣扎（而主动特质的猎物倾向于一直挣扎，无论逃脱的希望看起来多么渺茫）。 \n";
    }
    if (X >= N) {
        xsDesc =
            "<b>性欲 (X)</b> 性导向（性欲X型）的角色认为vore是一种诱惑，充满了快感的。通常来说，性导向的角色在被带入vore的情境中时会焦头烂额，因为它们可能会被引起冲动。性导向地捕食者会寻找能够满足它们性冲动，以及其它任何的动机的猎物，而这种动机包含饥饿、控制欲，以及（或者）在它们身体上增加一点食物的重量。性导向的猎物也因为类似的原因享受着，满足于变成捕食者的食物，玩物，或者身体需要的能量，不管它们是自愿的还是非自愿的。 \n";
    } else {
        xsDesc =
            "<b>感官 (N)</b> 非性导向（感官N型）的角色将vore看作纯粹的乐趣，满足，或者纯粹的饥饿。它们不会把vore和性元素连接在一起——这是性导向角色一般的特质。尽管如此，这也并不意味着它们不会在vore的经历中获得一些快感。非性导向的捕食者可以有非常多的动机，这依赖于它们本身的个人特质，但是通常来说，它们只是把vore当作获取食物，满足感，绑定关系，或者仅仅是乐趣的方式，而不是一种性欲。非性导向的猎物同样地享受着这种经历，不过并不把vore当作性癖——可能是因为它们只是不幸的非自愿猎物，一种足够纯粹的猎物，不会把被吞食当作一种恶趣味。 \n";
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
