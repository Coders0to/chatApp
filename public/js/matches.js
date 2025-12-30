$(document).on('click', '#viewBtn', function () {
    //code for hide hide other thinks
    $('.chat-input').hide();
    //end this 
    const profileInfo = profiles[profiles.length - 1];
    $('#chatName').text(profileInfo ? profileInfo.name : '' );
    $('#chatAvatar').attr('src',profileInfo.photo);
    $('#chatBody').html(`
        <div style="padding:12px;border-radius:12px;background:rgba(255,255,255,0.02);color:var(--cream)">
            <strong>About ${profileInfo.name}</strong>
            <p style="color:var(--muted);margin-top:6px">${profileInfo.bio}</p>
            <p style="color:var(--muted);margin-top:6px">Distance: ${profileInfo.dist}</p>
        </div>
    `);
});
$(document).on('click', '#msgBtn', function () {
    $('#helpFab').hide();
    $('.chat-input').show();
    const chatPanel = document.getElementById('chatPanel');
    const profileInfo = profiles[profiles.length - 1];
    const isActive = $('#'+profileInfo.id+'-status').text().trim();
    $('#active-status').text(isActive);
    $('#chatName').text(profileInfo.name+ ''+(profileInfo.age ? profileInfo.age +', ' : '' ));
    $('#chatAvatar').attr('src',profileInfo.photo);
    chatPanel.classList.add('open'); chatPanel.setAttribute('aria-hidden','false');
    document.getElementById('chatInput').focus();
    //code for load chat
    var userId =  profileInfo.id // $(this).attr('data-id');
    var userName = profileInfo.name //$(this).attr('data-name');
    var userImg = profileInfo.photo //$(this).attr('data-img');
    receiver_id = userId;
    cust_rec_id = receiver_id;
    $('.chat-section').show();
    socket.emit('existsChat',{sender_id:sender_id,receiver_id:receiver_id,userName:userName,userImg:userImg});
    //end code for load chat
});


var domainUrl = window.location.protocol + "//" + window.location.host;

//display old chat 
    socket.on('loaChats',function(loadchat,userName,userImg)
    {
        $('#chatBody').html(' ');
        var chats = loadchat.chats;
        $('.chat-heading').text(`${userName.userName}`);
        $('.chat-section-profile').html(`<img src="${domainUrl}/${userImg.userImg}" class="mt-2 chat-profile-icon" alt="" style="width:40px;height:40px;margin:10px;float:left;">`);
        let html = '';
        for(let x=0;x<chats.length;x++)
        {
            let addClass = '';
            //alert(chats[x]['sender_id']);
            if(chats[x]['sender_id']==sender_id)
            {
                addClass = 'current-user-chat';
            }
            else
            {
                addClass = 'distance-user-chat';
            }
            html += `<div class="${addClass} bubble me" id="${chats[x]['_id']}">
            ${chats[x]['message']}
                    `;

            if (chats[x]['sender_id'] == sender_id) {
                html += `<i class="fa fa-trash" aria-hidden="true" data-id="${chats[x]['_id']}" data-toggle="modal" data-target="#deleteChatModal"></i>`;
            }

            html += `</div>`;
            
        }
        $('#chatBody').append(html);
        scrollChat();
        
    });
    //chat save of user
    $(document).ready(function () {
        $('#chat-form').submit(function(event){
            event.preventDefault();
            var message = $('#chatInput').val();
            receiver_id= cust_rec_id
            $.ajax({
                url:'/save-chat',
                type:'post',
                data:{sender_id:sender_id,receiver_id:receiver_id,message:message},
                success:function(response){
                    if(response.success)
                    {
                        $('#chatInput').val('');
                        var chat = response.data.message;
                        console.log("chat response",response);
                        let html = `<div class="current-user-chat bubble me" id='`+response.data._id+`'>
                                        `+chat+`
                                            <i class="fa fa-trash" aria-hidden="true" data-id='`+response.data._id+`' data-toggle="modal" data-target="#deleteChatModal"></i>
                                    </div>`;
                        $('#chatBody').append(html);
                        socket.emit('newChat',response.data);
                        socket.emit('user-not-typing',receiver_id);
                        scrollChat();
                    
                    }
                    else
                    {
                        alert(response.data.msg);
                    }
                }
            });
        });
    });
    socket.on('loadNewChat',function(data){
        if(sender_id == data.receiver_id && receiver_id == data.sender_id)
        {
            let html = `<div class="distance-user-chat bubble me" id='`+data._id+`'>
                                    <p>`+data.message+`</p>
                                </div>`;
                    $('#chatBody').append(html);
                    scrollChat();
        }
    });
    function scrollChat()
    {
        $('#chatBody').animate({
            scrollTop:$('#chatBody').offset().top + $('#chatBody')[0].scrollHeight
        },0);
    }
    //code for check typing active or not
    let input = document.getElementById("chatInput");
    input.addEventListener("focus", () => {
         socket.emit('user-typing',receiver_id);
        console.log("Input field is focused");
    });
    input.addEventListener("blur", () => {
        socket.emit('user-not-typing',receiver_id);
    });
    socket.on('user-typing-res',function(receiver_id){
        if(sender_id == receiver_id)
        {
            let html = `<div class="typing show-hide">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    </div>
                                `;
                    $('#chat-container').append(html);
                    scrollChat();
        }
    });
    socket.on('user-not-typing-res',function(receiver_id){
        if(sender_id == receiver_id)
        {
            $('.show-hide').hide();
            scrollChat();
        }
    });
    socket.on('notifyUser-res',function(notify_user_id,notificationCount){
        if(sender_id==notify_user_id){
            console.log('notificationCount',notificationCount);
            $('#countNotify').text(notificationCount);
        }
    });
    //update user online status
    socket.on('getOnlineUser',function(data){
        $('#'+data.user_id+'-status').text('Online');
        $('#'+data.user_id+'-status').addClass('online-status');
        $('#'+data.user_id+'-status').removeClass('offline-status');
    });
    //update user offline status
    socket.on('getOflineUser',function(data){
        $('#'+data.user_id+'-status').text('Offline');
        $('#'+data.user_id+'-status').addClass('offline-status');
        $('#'+data.user_id+'-status').removeClass('online-status');
    });
    
