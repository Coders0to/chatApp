// Floating hearts generation
const heartsContainer = document.getElementById('hearts');
for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (8 + Math.random() * 5) + "s";
    heart.style.width = heart.style.height = (15 + Math.random() * 20) + "px";
    heartsContainer.appendChild(heart);
}

// Google Places Autocomplete
function initAutocomplete() {
    const input = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        document.getElementById('latitude').value = place.geometry.location.lat();
        document.getElementById('longitude').value = place.geometry.location.lng();
    });
}

// Form validation and submission
$(document).on('click', '#submit-btn', function(e) {
    e.preventDefault();
    const form = $('#user-register');
    let isValid = true;

    form.find('input[required], select[required]').each(function() {
        if (!$(this).val()) {
            $(this).addClass('error');
            isValid = false;
        } else {
            $(this).removeClass('error');
        }
    });

    if (!isValid) {
        toastr.error("Please fill all required fields");
        return false;
    }

    const formdata = new FormData(form[0]);
    $('#submit-btn').prop('disabled', true);

    $.ajax({
            type: 'POST',
            url: 'register',
            data: formdata,
            contentType: false,
            processData: false
        })
        .done(function(response) {
            if (response.success === true && response.data.statusCode === 200) {
                toastr.success(response.message);
                setTimeout(() => {
                    //window.location.href = response.data.redirect; 
                    // code for manage login page
                    $('#form-title').text('Login Panel');
                    $('#user-register').hide();
                    $('#user-login').show();
                    //end code for manage login page
                }, 1000);
            } else if (response.errors) {
                response.errors.forEach(e => toastr.error(e));
            }
        })
        .fail(() => toastr.error("Something went wrong!"))
        .always(() => $('#submit-btn').prop('disabled', false));
});
$(document).on('input change', 'input[required], select[required]', function() {
    if ($(this).val()) {
        $(this).removeClass('error');
    }
});



$(document).ready(function() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const formData = {
            email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val()
        };

        $.ajax({
            type: 'POST',
            url: '/',
            data: formData,
            success: function(response) {
                if (response.success == true) {
                    toastr.options = {
                        "timeOut": "1000",
                        "extendedTimeOut": "1000",
                        "closeButton": true,
                        "positionClass": "toast-top-right",
                        "progressBar": true,
                    };
                    toastr.success(response.message || "Login successful");
                    setTimeout(() => {
                        window.location.href = response.data.redirect;
                    }, 1000);

                } else if (response.message) {
                    toastr.success(response.message);
                }
            },
            error: function(xhr) {
                let errorMsg = "Login failed";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                toastr.error(errorMsg);
            }
        });
    });
});
$(document).ready(function() {
    // Show Login Form
    $('#show-login').on('click', function(e) {
        e.preventDefault();
        $('#form-title').text('Login Panel');
        $('#user-register').hide();
        $('#user-login').show();
    });

    // Show Register Form
    $('#show-register').on('click', function(e) {
        e.preventDefault();
        $('#user-register').find('input, select').removeClass('error');
        $('#form-title').text('Join LoveVerse');
        $('#user-register').show();
        $('#user-login').hide();
    });
});

// //second option for show address suggesstions
const ACCESS = "pk.730d12ad2b022ddf7061d435502bbc12";
let debounce, lastData = [];

$("#locationInput").on("input", function () {
    clearTimeout(debounce);
    let q = $(this).val().trim();

    if (q.length < 2) {
        $("#locationSuggestions").hide();
        return;
    }

    debounce = setTimeout(() => {
        $.get(`https://us1.locationiq.com/v1/autocomplete?key=${ACCESS}&q=${q}`, function (data) {

            lastData = data;
            let html = "";

            data.forEach((item, i) => {
                html += `<div class="suggest-item" data-i="${i}">${item.display_name}</div>`;
            });

            $("#locationSuggestions").html(html).show();
        });
    }, 500);
});

$(document).on("click", ".suggest-item", function () {
    const d = lastData[$(this).data("i")];

    $("#locationInput").val(d.display_name);
    $("#locationSuggestions").hide();
    console.log("Latitude:", d.lat);
    console.log("Longitude:", d.lon);
    $('#latitude').val(d.lat);
    $('#longitude').val(d.lon);

});

// const ACCESS_TOKEN = "pk.730d12ad2b022ddf7061d435502bbc12";
// let typingTimer;
// let delay = 500; // 0.5 second debounce
// let lastResults = []; // store API results
// $("#search").on("input", function () {
//     clearTimeout(typingTimer);
//     let query = $(this).val().trim();
//     if (query.length < 2) {
//         $("#suggestions").hide();
//         return;
//     }

//     typingTimer = setTimeout(() => {
//         $.get(`https://us1.locationiq.com/v1/autocomplete?key=${ACCESS_TOKEN}&q=${query}`, 
//             function (data) {
//                 lastResults = data; // store results

//                 let html = "";
//                 data.forEach((item, index) => {
//                     html += `<div class="suggest-item" data-index="${index}">
//                                 ${item.display_name}
//                              </div>`;
//                 });
//                 $("#suggestions").html(html).show();
//             }
//         ).fail(() => {
//             console.log("Rate Limit - Waiting...");
//         });
//     }, delay);
// });

// // Select autocomplete item + console lat/lon
// $(document).on("click", ".suggest-item", function () {
//     let index = $(this).data("index");
//     let selected = lastResults[index];

//     $("#search").val(selected.display_name);
//     $("#suggestions").hide();

//     console.log("📍 Selected Address:", selected.display_name);
//     console.log("➡ Latitude:", selected.lat);
//     console.log("➡ Longitude:", selected.lon);
// });
//end code this