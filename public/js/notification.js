function getNotifications()
{
    $.ajax({
        url:'/notifications',
        type:'post',
        success:function(response){
            if (response.success) {
                    const listEl = document.getElementById("notification-list");
                    const countEl = document.getElementById("notification-count");

                    // Clear existing notifications
                    listEl.innerHTML = "";

                    // Update count badge
                    countEl.textContent = response.data.userNotification.length;
                    $('.notification-count').text(response.data.userNotification.length);
                    // Loop through notifications
                    response.data.userNotification.forEach(notif => {
                        const notifClass = notif.is_read ? "notification" : "notification unread";
                        const notifHTML = `
                        <div class="${notifClass}">
                            <div class="avatar"><img src="${notif.sender_id.image}"></div>
                            <div class="content">
                            <div class="meta">
                                <span class="heading">${notif.title}</span>
                                <span class="time">${notif.created_at}</span>
                            </div>
                            <p class="message">${notif.message}</p>
                            </div>
                        </div>
                        `;
                        listEl.insertAdjacentHTML("beforeend", notifHTML);
                    });
                    }

            //console.log('success',success);
            //alert('success');
        },
        error:function(error){
            console.log('error',error);
        }
    });
}
getNotifications();