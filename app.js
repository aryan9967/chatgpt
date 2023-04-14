// Clear Chats
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

function chat() {
  var srchin = document.getElementById('search');
  var user_res = srchin.value;
  var bot_res = 'Mai nhi sun raha';
  var chat_area = document.getElementById('chat_area');
  var text = '';
  text += '   <div class="user_chat">' + user_res + '</div>';
  text += '   <div class="bot_chat">' + bot_res + '</div>';
  chat_area.innerHTML += text;
}
