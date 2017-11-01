var url = "http://localhost:3000/to-do-lists";

function template(data, idx) {
    return `
        <td class="my-pointer">
            <span class="${data.done === true ? 'my-status-done-true':''} my-font glyphicon glyphicon-unchecked" aria-hidden="true" onclick="doneToggle(${idx})"></span>
            <span class="${data.done === false ? 'my-status-done-true':''} my-font glyphicon glyphicon-check" aria-hidden="true" onclick="doneToggle(${idx})"></span>
        </td>

        <td class="${data.done === true ? 'my-style-done-true':''}">
            <small>
                ${data.time}
            </small>
            <p class="my-pointer my-status-edit my-font" onclick="doneToggle(${idx})">
                ${data.content}
            </p>

            <form class="my-status-edit-true my-status-edit my-update my-form form" action="javascript:;" onsubmit="return edit(this)">
                <div class="input-group">
                    <input type="hidden" class="form-control" value="${data.id}">
                    <input type="text" class="form-control" value="${data.content}">
                    <div class="input-group-addon">
                        <button type="submit" class="my-btn btn-info glyphicon glyphicon-floppy-disk"></button>
                    </div>
                </div>
            </form>
        </td>

        <td class="my-operation">
            <button type="button" class="my-btn my-btn-transparent text-info glyphicon glyphicon-pencil" onclick="editToggle(${idx})"></button>
            <button type="button" class="my-btn my-btn-transparent text-danger glyphicon glyphicon-trash" data-toggle="modal" data-target="#my-alert" onclick="deleteCheck(${idx})"></button>
        </td>
    `;
}

myRead();

/*
 * 需要建立一個 XMLHttpRequest 物件
 * 開啟一個 URL
 * 並發起一個請求
 */

// function makeRequest(url, method, data, onSuccess, onFail) {
//     var xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//
//     xhr.onloadend = function() {
//         if (xhr.status === 200) {
//             onSuccess(JSON.stringify(xhr.response || "{}"));
//         } else {
//             onFail(xhr);
//         }
//     };
//
//     xhr.send(data);
// }


// R：列表
function myRead() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    var resultAry = JSON.parse(xhr.responseText);
    var badge = 0;

    var tbody = document.querySelector("#list");
    tbody.innerHTML = "";

    resultAry.forEach(function(data, idx) {

        var tpl = template(data, idx);
        var tr = document.createElement('tr');

        tr.innerHTML = tpl;
        tbody.appendChild(tr);

        if (data.done === false) {
            badge += 1;
        }
    });

    document.querySelector("#badge").innerText = badge;
}

// C：新增
function myCreate(self) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    var data = {
        id: new Date().getTime(),
        content: self.querySelector("input[type='text']").value,
        time: new Date().toLocaleString([], {
            "hour12": false
        }),
        done: false
    };

    xhr.send(JSON.stringify(data));
    
    self.querySelector("input[type='text']").value = "";

    myRead();
}

// U：編輯
function myUpdate(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', url + '/' + data.id, false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    delete data.id;

    xhr.send(JSON.stringify(data));

    myRead();
}

// D：刪除
var deleteId;

function myDelete() {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url + '/' + deleteId, false);
    xhr.send();

    $("#my-alert").modal('hide');

    myRead();
}

// =====

// 狀態切換： 編輯狀態 / 一般狀態
function editToggle(idx) {
    var targetTd = document.querySelector("#list").children[idx].getElementsByTagName("td")[1];

    targetTd.querySelector("input[type='text']").value = targetTd.querySelector("p").innerText;

    targetTd.querySelectorAll(".my-status-edit").forEach(function(target) {
        target.classList.toggle("my-status-edit-true");
    });
}

// 狀態修改： 已完成 / 未完成
function doneToggle(idx) {
    var targetTd = document.querySelector("#list").children[idx].getElementsByTagName("td")[1];

    var data = {
        id: targetTd.querySelector("input[type='hidden']").value,
        done: !targetTd.classList.contains('my-style-done-true')
    };

    myUpdate(data);
}

// 編輯內容
function edit(self) {
    var data = {
        id: self.querySelector("input[type='hidden']").value,
        content: self.querySelector("input[type='text']").value,
    };

    myUpdate(data);
}

// 刪除確認
function deleteCheck(idx) {
    var targetTd = document.querySelector("#list").children[idx].getElementsByTagName("td")[1];

    deleteId = targetTd.querySelector("input[type='hidden']").value;
    document.querySelector("#delete-content").innerText = targetTd.querySelector("p").innerText;
}
