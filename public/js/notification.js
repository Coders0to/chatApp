function getNotifications()
{
    $.ajax({
        url:'/notifications',
        type:'post',
        success:function(response){
            if (response.success) {
                    const listEl = document.getElementById("notification-list2");
                    const countEl = document.getElementById("notification-count");
                    listEl.innerHTML = "";
                    countEl.textContent = response.data.userNotification.length;
                    $('.notification-count').text(response.data.userNotification.length);
                    response.data.userNotification.forEach(notif => {
                        const notifClass = notif.is_read ? "notification" : "notification unread";
                        // <div class="avatar"><img src="${notif.sender_id.image}"></div>
                        const notifHTML = `
                        <div class="${notifClass}">
                            
                            <div class="content">
                            <div class="meta">
                                <span class="heading">${notif.title}</span>
                                <span class="time">${notif.created_at}</span>
                            </div>
                            <p class="message">${notif.message}</p>
                            </div>
                        </div>
                        `;
                        //listEl.innerHTML = notifHTML;
                         listEl.insertAdjacentHTML("beforeend", notifHTML);
                    });
                    readNotifications();
                }
        },
        error:function(error){
            console.log('error',error);
        }
    });
}
getNotifications();

function readNotifications()
{
    $.ajax({
        url:'/readNotifications',
        type:'get',
        success:function(response){
            if (response.success) {
                   
                }
        },
        error:function(error){
            console.log('error',error);
        }
    });
}

