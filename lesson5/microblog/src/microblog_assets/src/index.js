import { microblog } from "../../declarations/microblog";
import $ from "jquery";
import { Principal } from "@dfinity/principal";
var info = {};
var type = "";
var posts = [];
var timeline = [];
var follows = [];
var userPosts =[];
var isTriggered = false;
$(function () {
  getInfo();
  getPosts();
  getFollows();
  $("#edit_name").click(function () {
    showDialog("Modify Name", "Input Your New Name:");
  });

  $("#setting").click(function () {
    showDialog("Modify Passord", "Input New Password:");
  });

  $("#post").click(function () {
    showDialog("Post New Message", "Input Your Message:");
  });
  $("#follow").click(function () {
    showDialog("Follow", "Input follow Canister ID:");
  });
  $("#posts").click(function () {
    switchMessages("posts");
    setPosts();
  });
  $("#timeline").click(function () {
    switchMessages("timeline");
    setTimeLine();
  });
  $("#follow-list").on("click", ".avatar", function (e) {
   // alert("点击了动态li标签, id: "+ e.target.id);
   console.log("id is :"+e.target.id);
    switchMessages(e.target.id);
    getUserPosts(e.target.id);
  });

});

function switchMessages (key) {
    switch (key) {
      case "posts":
       $("#timeline").removeClass("post-area-span");
       $("#timeline").addClass("post-area-span-unselect");
       $("#posts").removeClass("post-area-span-unselect");
       $("#posts").addClass("post-area-span");
        $("#user").text("");
        break;
      case "timeline":
         $("#posts").removeClass("post-area-span");
         $("#posts").addClass("post-area-span-unselect");
         $("#timeline").removeClass("post-area-span-unselect");
         $("#timeline").addClass("post-area-span");       
        $("#user").text("");
        break;
      default:
        $("#timeline").removeClass("post-area-span");
        $("#timeline").addClass("post-area-span-unselect");
        $("#posts").removeClass("post-area-span");
        $("#posts").addClass("post-area-span-unselect");
        $("#user").text(key);
        break;  
    }
}

async function getInfo() {
  info = await microblog.getInfo();
  $("#name").text("This is " + info.userName + "'s Blog!");
  $("#my-id").text("Follow me by my canister ID: " + info.cId);
}

async function getUserPosts(id){
  showLoading(true);
  userPosts = await microblog.followPosts(id, 1000000);
  showLoading(false);
  setMessages(userPosts);
}

async function setPosts() {
  if (posts.length == 0) await getPosts();
  else setMessages(posts);
}

async function setTimeLine() {
  if (timeline.length == 0) await getTimeLine();
  else setMessages(timeline);
}

async function getPosts() {
  showLoading(true);
  posts = await microblog.posts(1000000);
  showLoading(false);
  setMessages(posts);
}

async function getTimeLine() {
  showLoading(true);
  timeline = await microblog.timeline(1000000);
  showLoading(false);
  setMessages(timeline);
}

async function getFollows() {
  showLoading(true);
  follows = await microblog.followsInfo();
  showLoading(false);
  setFollows(follows);
}

function setMessages(arr) {
  var html = "";
  for (var post of arr) {
    html =
      html +
      '<li><div><span class="post-content">' +
      post.content +
      '</span><div class="post-mark"><span>' +
      "Author: " +
      post.author +
      '</span></div><div class="post-mark"><span class="post-time">' +
      "Time: " +
      timeStamp2Time(post.time) +
      '</span></div><div class="divider"></div></div> </li>';
  }
  $("#post-list").html(html);
}

function setFollows(arr) {
  $("#follow-list").html("");
  for (var f of arr) {
   var li =
      
      '<li><div><div class="follow-line"><span id="' +
      f.id +
      '" class="avatar material-icons  md-36">account_circle</span><span>' +
      (f.name === "" ? "Unnamed" : f.name) +
      '</span> </div> <div class=" follow-mark"><span id="id" class="follow-id"> ' +
      f.id +
      '</span></div><div class="divider"></div></li>';
      $(li).data('info',f);
      $(li).appendTo($("#follow-list"));
  }
  //$("#follow-list").html(html);
}

function showDialog(title, hint) {
  $("#title").text(title);
  $("#label").text(hint);
  $(".dialog-bg").show();
  type = title;
  $("#cancel").click(function () {
    $(".dialog-bg").hide();
    resetDialog();
  });
  $("#dialog-post").click(function () {
    if (isTriggered) return;
    isTriggered = true;
    var password = $("#pwd").val().trim();
    var message = $("#textarea").val().trim();
    switch (type) {
      case "Modify Name":
        modifyName(message, password);
        break;
      case "Post New Message":
        post(message, password);
        break;
      case "Modify Passord":
        modifyPassword(message, password);
        break;
      case "Follow":
        follow(message, password);
        break;
    }
  });
}

function userClick(e,f){

  console.log("clicked id: "+e.id +", userinfo :" + f.name )
}

async function modifyName(message, password) {
  showLoading(true);
  try {
    await microblog.set_name(password, message);
    showLoading(false);
    $(".dialog-bg").hide();
    resetDialog();
    getInfo();
  } catch (error) {
    isTriggered = false;
    showLoading(false);
    $("#hint-error").text("Modify Name failed!");
  }
}

async function follow(message, password) {
  showLoading(true);

  try {
    await microblog.follow(password, Principal.fromText(message));
    showLoading(false);
    $(".dialog-bg").hide();
    resetDialog();
    getFollows();
  } catch (error) {
    isTriggered = false;
    showLoading(false);
    $("#hint-error").text("Follow blog failed!");
  }
}

async function modifyPassword(message, password) {
  showLoading(true);
  try {
    await microblog.modifyPassword(password, message);
    showLoading(false);
    $(".dialog-bg").hide();
    resetDialog();
  } catch (error) {
    isTriggered = false;
    showLoading(false);
    $("#hint-error").text("Modify password failed!");
  }
}

async function post(message, password) {
  showLoading(true);
  try {
    await microblog.post(password, message);
    showLoading(false);
    $(".dialog-bg").hide();
    resetDialog();
    getPosts();
  } catch (error) {
    isTriggered = false;
    showLoading(false);
    $("#hint-error").text("Post Message failed!");
  }
}

function resetDialog() {
  type = "";
  $("#textarea").val("");
  $("#pwd").val("");
  $("#hint-error").text("");
  isTriggered = false;
}

function showLoading(is_shown) {
  if (is_shown) {
    $("#loading").show();
  } else {
    $("#loading").hide();
  }
}

function timeStamp2Time(timestamp) {
  var date = new Date(parseInt(timestamp / 1000000n) + 8 * 3600 * 1000); // 增加8小时
  console.log(date.toJSON());
  return date.toJSON().substring(0, 16).replace("T", " ");
}
