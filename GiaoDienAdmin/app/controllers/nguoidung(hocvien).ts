
import * as $ from 'jquery';
import swal from 'sweetalert';

// import 'popper.js';
// import 'font-awesome/css/font-awesome.css';
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/css/style.css';
// import '../helpers/notification';
// import './taikhoan';

import { KhoaHoc } from '../models/KhoaHoc';
import { DanhSachKhoaHoc } from '../models/DanhSachKhoaHoc';
import { DanhSachNguoiDung } from '../models/DanhSachNguoiDung';
import { KhoaHocService } from '../services/KhoaHocService';
import { NguoiDungService } from '../services/NguoiDungService';
var danhSachKhoaHoc = new DanhSachKhoaHoc();
var khoaHocService = new KhoaHocService();
var nguoiDungService = new NguoiDungService();
var danhSachNguoiDung = new DanhSachNguoiDung();
//Gọi phương thức lấy danh sách khóa học từ api
khoaHocService.LayDanhSachKhoaHoc().done(function(DSKH){
    danhSachKhoaHoc.DSKhoaHoc = DSKH;
    LoadDanhSachKhoaHoc(danhSachKhoaHoc.DSKhoaHoc);
    LoadDanhSachGiaoVien();
});
function LoadDanhSachGiaoVien(){
    var dsgv = new NguoiDungService();
    dsgv.LayDanhSachNguoiDung().done(function(DSNguoiDung){
        danhSachNguoiDung.DSNguoiDung = DSNguoiDung;
        LayThongTinGiaoVien(danhSachNguoiDung.DSNguoiDung);
    });
}
function LayThongTinGiaoVien(DSNguoiDung){
    var noiDungSelect= "";
    for(var i=0; i<DSNguoiDung.length;i++){
        var nd=  DSNguoiDung[i];
        if(nd.MaLoaiNguoiDung ==="GV"){
            noiDungSelect+=`
            <option value='${nd.TaiKhoan}'>${nd.HoTen}</option>
            `;
        }
    }$("#NguoiTao").html(noiDungSelect);
}
function LoadDanhSachKhoaHoc(DSKH){
    var noiDungTable ="";
    for (var i=0; i<DSKH.length; i++){
        var khoaHoc = DSKH[i];
        noiDungTable+=`
            <tr>
                <td><input type="checkbox" class="ckbMaKhoaHoc" value="${khoaHoc.MaKhoaHoc}"/></td>
                <td>${khoaHoc.TenKhoaHoc}</td>
                <td><img src='${khoaHoc.HinhAnh}'style="width:100px; height:150px"/></td>
                <td>${khoaHoc.LuotXem}</td>
                <td>${khoaHoc.NguoiTao}</td>
                <td>
                    <button class="btn btn-primary btnEdit"  MaKhoaHoc="${khoaHoc.MaKhoaHoc}" ><i class="fa fa-pencil">Edit</i></button> 
                </td>
                <td><button class="btn btn-danger btnDel" MaKhoaHoc="${khoaHoc.MaKhoaHoc}"><i class="fa fa-trash-o">Delete</i></button> </td>
                <td>
            </td>
            </tr>
        `;
        // <th>${khoaHoc.MoTa}</th>
    }
    $("#tblDanhSachKhoaHoc").html(noiDungTable);
    
}

$("body").delegate(".btnDel","click", function(){
    var makh = $(this).attr("MaKhoaHoc");
    danhSachKhoaHoc.XoaKhoaHoc(makh);
    LoadDanhSachKhoaHoc(danhSachKhoaHoc.DSKhoaHoc);

});
$("body").delegate(".btnEdit","click", function(){
    var btnEdit= $(this);
    var title ="Chỉnh sửa thông tin khóa học";
    var KhoaHoc = danhSachKhoaHoc.LayKhoaHoc(btnEdit.attr("MaKhoaHoc"));

    var footer =`
        <button class="btn btn-success" id="btnSave">Save</button>
        <button class="btn btn-success" id="btnClose">Close</button>
    `;

    $(".modal-title").html(title);
    $(".modal-footer").html(footer);
    $("#MaKhoaHoc").val(KhoaHoc.MaKhoaHoc);
    $("#MaKhoaHoc").attr("readonly","true");
    $("#TenKhoaHoc").val(KhoaHoc.TenKhoaHoc);
    CKEDITOR.instances["MoTa"].setData(KhoaHoc.MoTa);
    $("#LuotXem").val(KhoaHoc.LuotXem);
    $("#NguoiTao").val(KhoaHoc.NguoiTao);
    $("#btnOpenPopup").trigger("click");

});
$("body").delegate("#btnClose", "click", function(){
    $(".close").trigger("click");
});
$("body").delegate("#btnSave", "click", function(){
    var MaKH: string = (<HTMLInputElement> document.getElementById("MaKhoaHoc")).value;
    var TenKH =  $("#TenKhoaHoc").val();
    var HinhAnh = "";
    var MoTa = CKEDITOR.instances["MoTa"].getData();

    var LuotXem = $("#LuotXem").val();
    var NguoiTao = $("#NguoiTao").val(); 

    var khoaHoc = new KhoaHoc(MaKH, TenKH, MoTa, HinhAnh, LuotXem, NguoiTao);

    danhSachKhoaHoc.SuaKhoaHoc(khoaHoc);
    LoadDanhSachKhoaHoc(danhSachKhoaHoc.DSKhoaHoc);
    $("#MaKhoaHoc").removeAttr("readonly");
});

CKEDITOR.replace("MoTa");
$("#btnThemKhoaHoc").click(function(){
    var title ="Thêm thông tin khóa học";

    var footer =`
        <button class="btn btn-success" id="btnAdd">Add</button>
        <button class="btn btn-success" id="btnClose">Close</button>
    `;
    $(".modal-title").html(title);
    $(".modal-footer").html(footer);
    $(".delText").val("");

});
$("body").delegate("#btnAdd","click", function(){
    var MaKhoaHoc = $("#MaKhoaHoc").val();
    var TenKhoaHoc = $("#TenKhoaHoc").val();
    var LuotXem = $("#LuotXem").val();
    var NguoiTao = $("#NguoiTao").val();
    //Lấy giá trị mô tả
    var MoTa = CKEDITOR.instances["MoTa"].getData();
    var khoaHoc = new KhoaHoc(MaKhoaHoc, TenKhoaHoc, MoTa,"", LuotXem, NguoiTao);
    danhSachKhoaHoc.ThemKhoaHoc(khoaHoc);
    LoadDanhSachKhoaHoc(danhSachKhoaHoc.DSKhoaHoc);
    $(".delText").val("");
});

function ThongBao(){
	swal("Good job!", "You clicked the button!", "success");
}