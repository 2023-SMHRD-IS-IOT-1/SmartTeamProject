function deleteSelected() {
    // const sql_del = 'delete from products where p_code=?';
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    var deleteCount = 0
    let deleteData = []
    for (let i = 0; i < checkboxes.length; i++) {
        deleteData.push(checkboxes[i].value);
    }
    console.log(deleteData);
    let url = "/user/deleteItem";
    fetch(url, { //보내기
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: deleteData
        })
    })
        .then(res => res.json()) //user.js에서 받음
        .then(data => {
            console.log(data);
            if (data.success) {
                location.href = "/user/itemManage";
                alert("상품이 삭제되었습니다.");
            }
        })
};

function changebutton() {

    console.log('update function')
    let form_tag = document.getElementsByTagName("form")[2];
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
    if (checkboxes.length === 1) {
        // console.log(form_tag.attributes.action);
        form_tag.setAttribute("action", "/user/update");
        // console.log(form_tag.attributes.action);
        let btn = document.getElementById("changebtn");
        btn.innerHTML = "수정";
        let td_data = document.querySelectorAll('td:has(input[type="checkbox"]:checked) ~ td')
        console.log(td_data);
        let form_div = document.querySelectorAll(".form-group");
        form_div[0].innerHTML = form_div[0].innerHTML + "<input type='hidden' name='p_code' id='p_code' value='"+td_data[1].innerHTML+"'>"//✨✨
        document.getElementById("p_name").value = td_data[0].innerHTML;
        document.getElementById("p_weight").value = td_data[2].innerHTML;
        document.getElementById("p_category").value = td_data[4].innerHTML;
        document.getElementById("shelf_loc").value = td_data[5].innerHTML;
        console.log(document.querySelector('#checkbox1 input[type="checkbox"]:checked').value)
    
    } else {
        alert("하나를 선택해주세요.")
    }
}