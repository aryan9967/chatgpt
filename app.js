// Clear Chats
var my_time;
var count = 0;
var repeat = 0;
var res_rep = 0;
var scrrep = 0;
var serverUrl;
serverUrl = 'https://dc42-35-237-211-15.ngrok.io';

function nav() {
  console.log('click');
  repeat++;
  res_rep = repeat % 2;
  var main = document.getElementById('main');
  var navdraw = document.getElementById('navdraw');
  var check = document.getElementById('check');
  console.log(res_rep);
  if (res_rep == 1) {
    navdraw.style.display = 'block';
    // main.style.flexDirection = 'row';
  } else {
    navdraw.style.display = 'none';
  }
}

function urlchange() {
  serverUrl = document.getElementById('urlin').value;
  console.log(serverUrl);
}

function pageScroll() {
  // If condition to set repeat
  if (count < 2) {
    var objDiv = document.getElementById('chat_area');
    var navbar = document.getElementById('navbar');
    objDiv.scrollTop = objDiv.scrollTop + 1;
    var sum = objDiv.getBoundingClientRect().height + objDiv.scrollTop;
    if (sum >= objDiv.scrollHeight) {
      return;
    }
    scrrep++;
    if (objDiv.scrollTop == objDiv.scrollHeight - 61) {
      setTimeout(function () {
        scrrep++;
        count++;
        console.log(objDiv.scrollTop);
        console.log(objDiv.scrollHeight);
      }, 1200);
      console.log(objDiv.scrollTop);
      console.log(objDiv.scrollHeight);
    }
    //set scrolling time start
    my_time = setTimeout('pageScroll()', 15);
    //set scrolling time end
    return;
  }
  return;
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
  train();
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

function enter_chat() {
  var search = document.getElementById('search');
  search.addEventListener('keydown', check_enter);
}

function check_enter(e) {
  if (e.key == 'Enter') {
    chat();
    return;
  }
}

async function chat() {
  var my_time;
  var count = 0;
  var srchin = document.getElementById('search');
  var chat_area = document.getElementById('chat_area');
  var user_res = srchin.value;
  if (user_res == '') {
    return;
  }
  srchin.value = '';
  var text = '';
  text +=
    '   <div class ="user_chat"><span class="user_span">' +
    user_res +
    '</span></div>';
  chat_area.innerHTML += text;
  srchin.focus();
  setTimeout('pageScroll()', 1200);
  text = '';
  var url = serverUrl + '/llm/inference';
  var data = { prompt: user_res };
  var bot_res = await postJSON(url, data);
  var bot_response = bot_res['data']['response'];
  text += '   <div class="bot_chat"><span  >' + bot_response + '</span></div>';
  chat_area.innerHTML += text;
  setTimeout('pageScroll()', 1200);
  return;
}
