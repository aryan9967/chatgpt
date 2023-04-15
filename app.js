// Clear Chats
var my_time;
var count = 0;
var serverUrl;
serverUrl = 'https://c3f8-35-234-23-208.ngrok.io';
function urlchange() {
  serverUrl = document.getElementById('urlin').value;
  console.log(serverUrl);
}

function pageScroll() { 
  // If condition to set repeat 
  if (count < 2) {
    var objDiv = document.getElementById("chat_area");
    objDiv.scrollTop = objDiv.scrollTop + 1;
    if (objDiv.scrollTop == (objDiv.scrollHeight - 61)) {
      setTimeout(function() {
        objDiv.scrollTop = 0;
        count++;
        }, 1200);
    }
    //set scrolling time start
    my_time = setTimeout('pageScroll()', 10);
    //set scrolling time end
  }
}

async function train() {
  url = serverUrl + '/llm/train';
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);
}

async function get_files() {
  var file_disp = document.getElementById('display_file');
  var text = '';
  url = serverUrl + '/get_filenames';
  const response = await fetch(url);
  var file_name = await response.json();
  file_name = file_name['data'];
  for (var x in file_name) {
    text +=
      '    <div class="file"><label class="file_name">' +
      file_name[x] +
      '</label><i class="fa-solid fa-trash" style="color: #fafcff;" onclick = "deletefile()"></i></div>\n';
  }
  file_disp.innerHTML += text;
}

async function refresh() {
  var file_disp = document.getElementById('display_file');
  var text = '';
  url = serverUrl + '/get_filenames';
  const response = await fetch(url);
  var file_name = await response.json();
  file_name = file_name['data'];
  file_disp.innerHTML = '';
  for (var x in file_name) {
    text +=
      '    <div class="file" id="' +
      file_name[x] +
      '"><label class="file_name">' +
      file_name[x] +
      '</label><i id="' +
      x +
      '"class="fa-solid fa-trash" style="color: #fafcff;" onclick = "deletefile()" ></i></div>\n';
  }
  file_disp.innerHTML += text;
}

async function deletefile() {
  var file_disp = document.getElementById('display_file');
  file_disp.addEventListener('click', async (e) => {
    var id = e.target.id;
    console.log('id:' + id);
    var icon = document.getElementById(id);
    var filename = icon.parentNode.id;
    console.log('filename:' + filename);
    url = serverUrl + '/remove_file';
    var data = { filenames: [filename] };
    var bot_res = await postJSON(url, data);
    console.log(bot_res);
    refresh();
    train();
    return;
  });
}

async function remove_all() {
  url = serverUrl + '/remove_all';
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);
  clear_chat();
  refresh();
}

async function postJSON(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function upload(formData) {
  url = serverUrl + '/upload_file';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
  refresh();
}

async function upload_files() {
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');

  //   formData.append('username', 'abc123');
  formData.append('file', fileField.files[0]);

  upload(formData);
}

function clear_chat() {
  var chat_area = document.getElementById('chat_area');
  chat_area.innerHTML = '';
}

// Display Files
function file() {
  var files = document.getElementById('upload_file').files;
  var disp_file = document.getElementById('display_file');
  let text = '';
  for (var x in files) {
    var file_name = files[x]['name'];
    if (x == 'length') {
      break;
    }
    text += '    <div class="dfile">';
    text += '        <button>' + file_name + '</button>';
    text += '        <button>Delete</button>';
    text += '    </div>';
  }
  disp_file.innerHTML += text;
}

async function chat() {
  var my_time;
  var count = 0;
  var srchin = document.getElementById('search');
  var chat_area = document.getElementById('chat_area');
  var user_res = srchin.value;
  srchin.value = '';
  var text = '';
  text +=
    '   <div class ="user_chat"><span class="user_span">' +
    user_res +
    '</span></div>';
  chat_area.innerHTML += text;
  text = '';
  var url = serverUrl + '/llm/inference';
  var data = { prompt: user_res };
  var bot_res = await postJSON(url, data);
  var bot_response = bot_res['data']['response'];
  text += '   <div class="bot_chat"><span  >' + bot_response + '</span></div>';
  chat_area.innerHTML += text;
  setTimeout('pageScroll()', 1200);
}
