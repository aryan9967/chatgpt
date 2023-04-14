// Clear Chats

const serverUrl = 'https://e9f8-104-199-136-60.ngrok.io';
async function train() {
  url = serverUrl + '/llm/train';
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);
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
      method: 'PUT',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

const formData = new FormData();
const fileField = document.querySelector('input[type="file"]');

formData.append('username', 'abc123');
formData.append('avatar', fileField.files[0]);

console.log(formData);

upload(formData);

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
    console.log(file_name);
  }
  disp_file.innerHTML = text;
  console.log(disp_file);
}

async function chat() {
  var srchin = document.getElementById('search');
  var user_res = srchin.value;
  var url = serverUrl + '/llm/inference';
  var data = { prompt: user_res };
  var bot_res = await postJSON(url, data);
  var bot_response = bot_res['data']['response'];
  var chat_area = document.getElementById('chat_area');
  var text = '';
  text += '   <div class="user_chat">' + user_res + '</div>';
  text += '   <div class="bot_chat">' + bot_response + '</div>';
  chat_area.innerHTML += text;
}
