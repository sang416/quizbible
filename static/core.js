const quizData = [
    {
        question: "1. 창세기는 무엇으로 시작되나요?",
        choices: ["하나님의 천지 창조", "아브라함의 이야기", "요셉의 이야기", "다윗의 시편"],
        correct: 0
    },
    {
        question: "2. 출애굽의 표면적 이유는 무엇인가요?",
        choices: ["애굽 제국의 박해", "가나안 정복", "유월절", "홍해 건넘"],
        correct: 0
    },
    {
        question: "3. 레위기는 무엇에 관한 책인가요?",
        choices: ["제사장 나라의 교과서", "이스라엘의 역사", "다윗의 시편", "솔로몬의 잠언"],
        correct: 0
    },
    {
        question: "4. 사사기는 어떤 시대의 이야기인가요?",
        choices: ["제사장 나라 1단계 흉년 징계", "다윗의 왕국", "솔로몬의 성전", "바벨론 포로"],
        correct: 0
    },
    {
        question: "5. 신구약 중간기에 어떤 제국이 등장했나요?",
        choices: ["헬라 제국", "로마 제국", "페르시아 제국", "바벨론 제국"],
        correct: 0
    },
    {
        question: "6. 예수님께서 탄생하신 곳은 어디인가요?",
        choices: ["베들레헴", "예루살렘", "나사렛", "가버나움"],
        correct: 0
    },
    {
        question: "7. 예수님께서 십자가에서 선언하신 것은 무엇인가요?",
        choices: ["다 이루었다", "사랑하라", "믿으라", "회개하라"],
        correct: 0
    },
    {
        question: "8. 바울은 어디에서 예수님을 만났나요?",
        choices: ["다메섹 길", "예루살렘", "안디옥", "로마"],
        correct: 0
    },
    {
        question: "9. 로마 대화재 사건 후 기독교 지도자들은 어떻게 되었나요?",
        choices: ["로마 방화범으로 지목되어 처형", "로마 시민으로 인정", "로마 황제의 보호", "로마에서 추방"],
        correct: 0
    },
    {
        question: "10. 사도 요한은 어떤 책을 기록했나요?",
        choices: ["계시록", "잠언", "시편", "전도서"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");
const popupEl = document.getElementById("popup");

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    questionEl.innerText = currentQuizData.question;
    
    // 보기와 정답 인덱스를 함께 섞기 위한 배열 생성
    const choicesWithIndex = currentQuizData.choices.map((choice, index) => ({
        text: choice,
        isCorrect: index === currentQuizData.correct
    }));
    
    // 보기 섞기
    const shuffledChoices = shuffle([...choicesWithIndex]);
    
    choicesEl.innerHTML = "";
    shuffledChoices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.classList.add("choice");
        button.dataset.correct = choice.isCorrect;
        button.addEventListener("click", () => selectChoice(index));
        choicesEl.appendChild(button);
    });
}

function selectChoice(choice) {
    const choices = document.getElementsByClassName("choice");
    for (let i = 0; i < choices.length; i++) {
        choices[i].classList.remove("selected");
    }
    choices[choice].classList.add("selected");
}

function showResults() {
    quizEl.classList.add("hide");
    resultsEl.classList.remove("hide");
    scoreEl.innerText = `${score * 10}`;
}

function showPopup(isCorrect) {
    popupEl.textContent = isCorrect ? "정답" : "오답";
    popupEl.className = `popup ${isCorrect ? 'correct' : 'incorrect'}`;
    popupEl.style.display = "block";
    
    setTimeout(() => {
        popupEl.style.display = "none";
    }, 1000);
}

// 방문자 수 관리 함수
function updateVisitorCount() {
    fetch('/update_visitor_count', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('visitor-count').textContent = data.count;
    });
}

// 현재 방문자 수 가져오기
function getVisitorCount() {
    fetch('/get_visitor_count')
    .then(response => response.json())
    .then(data => {
        document.getElementById('visitor-count').textContent = data.count;
    });
}

submitBtn.addEventListener("click", () => {
    const selected = document.querySelector(".choice.selected");
    if (!selected) return;
    
    const isCorrect = selected.dataset.correct === "true";
    showPopup(isCorrect);
    
    if (isCorrect) {
        score++;
    }
    
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        setTimeout(() => {
            loadQuestion();
        }, 1000);
    } else {
        setTimeout(() => {
            showResults();
        }, 1000);
    }
});

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    quizEl.classList.remove("hide");
    resultsEl.classList.add("hide");
    loadQuestion();
});

// 페이지 로드 시 방문자 수 업데이트
window.addEventListener('load', () => {
    updateVisitorCount();
    loadQuestion();
});
