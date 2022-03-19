let taskListElem;

// タスクの連想配列の配列
let tasks = [{
        name: "ライブの申し込み",
        dueDate: "2022/03/01",
        isCompleted: false,
    },
    {
        name: "セトリの予想",
        dueDate: "2022/03/31",
        isCompleted: false,
    },
    {
        name: "サイリウムの注文",
        dueDate: "2022/03/19",
        isCompleted: false,
    },
];

window.addEventListener("load", function() {
    // リストを取得
    taskListElem = document.querySelector("ul");

    // LocalStorage から配列を読み込む
    loadTasks();
    // 配列からリストを出力
    renderTasks();
});

function renderTasks() {
    // リストの中身をキレイキレイ
    taskListElem.innerHTML = "";

    // 完了済みタスクの件数を数えるための変数を初期化
    let numOfCompletedTasks = 0;

    for (let task of tasks) {
        // リストの項目を作成
        let taskElem = document.createElement("li");
        taskElem.innerText = task.name;

        // 項目をクリックまたはダブルクリックされたときの動作を設定
        taskElem.addEventListener("click", function() {
            // リストの項目をクリックされたときは、タスクの完了状態をトグル
            toggleTaskComplete(task.name);
        });
        taskElem.addEventListener("dblclick", function() {
            // リストの項目をダブルクリックされたときは、タスクを削除
            deleteTask(task.name);
        });

        // タスクの完了状況に応じ、項目の取り消し線を設定
        if (task.isCompleted) {
            taskElem.style.textDecorationLine = "line-through";
            numOfCompletedTasks++;
        } else {
            taskElem.style.textDecorationLine = "none";
        }

        // 期限表示を作成
        let taskDueDateElem = document.createElement("span");
        taskDueDateElem.style.fontSize = "0.8rem";
        taskDueDateElem.style.fontStyle = "italic";
        taskDueDateElem.style.marginLeft = "1rem";
        if (task.dueDate) {
            taskDueDateElem.innerText = task.dueDate;
        } else {
            taskDueDateElem.innerText = "";
        }

        //日付比較
        let limitDate = new Date(task.dueDate);
        limitDate.setHours(0);
        limitDate.setMinutes(0);
        limitDate.setSeconds(0);
        limitDate.setMilliseconds(0);
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        console.log(today);
        if (today.getTime() == limitDate.getTime()) {
            taskDueDateElem.style.color = "yellow";
        } else if (today.getTime() > limitDate.getTime()) {
            taskDueDateElem.style.color = "red";
        } else {
            taskDueDateElem.style.color = "black";
        }

        //残り日数表示
        let taskDayElem = document.createElement("span");
        taskDayElem.style.fontSize = "0.8rem";
        taskDayElem.style.fontStyle = "italic";
        taskDayElem.style.marginLeft = "1rem";
        let remnum = (limitDate.getTime() - today.getTime()) / 86400000;

        if (remnum < 0) {
            task.dueDate = "";
        } else if (remnum == 0) {
            taskDayElem.style.color = "red";
        }

        let remday = "残り日数: " + remnum + "日";
        if (task.dueDate) {
            taskDayElem.innerText = remday;
        } else {
            taskDayElem.innerText = "";
        }

        taskElem.appendChild(taskDayElem);

        // 項目に対し、期限表示を追加
        taskElem.appendChild(taskDueDateElem);

        // リストに対し、項目を追加
        taskListElem.appendChild(taskElem);
    }

    // 全タスクの件数を更新
    let numOfTasksElem = document.querySelector("#numOfTasks");
    numOfTasksElem.innerText = tasks.length;

    // 完了済みタスクの件数を更新
    let numOfCompletedTasksElem = document.querySelector("#numOfCompletedTasks");
    numOfCompletedTasksElem.innerText = numOfCompletedTasks;
}

function addTask(taskName, taskDueDate) {
    // 配列に対し、項目を追加
    tasks.push({
        name: taskName,
        dueDate: taskDueDate,
        isCompleted: false,
    });

    // LocalStorage へ配列を保存
    saveTasks();
    // 配列からリストを再出力
    renderTasks();

    //form1をリセット
    document.querySelector("form1").reset();
}

function deleteTask(taskName) {
    // 新しい配列を用意
    let newTasks = [];
    // 現状の配列を反復
    for (let task of tasks) {
        if (task.name != taskName) {
            // 削除したいタスク名でなければ、新しい配列へ追加
            newTasks.push(task);
        }
    }
    // 現状の配列を新しい配列で上書き
    tasks = newTasks;

    // LocalStorage へ配列を保存
    saveTasks();
    // 配列からリストを再出力
    renderTasks();
}

function toggleTaskComplete(taskName) {
    // 現状の配列を反復
    for (let task of tasks) {
        if (task.name == taskName) {
            // 対象のタスク名ならば、完了状態をトグル
            task.isCompleted = !task.isCompleted;
        }
    }

    // LocalStorage へ配列を保存
    saveTasks();
    // 配列からリストを再出力
    renderTasks();
}

function loadTasks() {
    let jsonString = window.localStorage.getItem("tasks");
    if (jsonString) {
        tasks = JSON.parse(jsonString);
    }
}

function saveTasks() {
    let jsonString = JSON.stringify(tasks);
    window.localStorage.setItem("tasks", jsonString);
}