const crypto = require("crypto");
const qs = require("qs");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const Payment = require("../../payment/data-access/PayModel");
const Cart = require("../.././cart/data-access/CartModel");
dotenv.config({ path: "config.env" });
const PaymentService = {
    vnPay: async (req, res) => {
        try {
            const { totalPrice } = req.body;
            const BASE_URL = process.env.BASE_URL;
            const tongtien = Math.round(totalPrice * 23500);
            const vnp_TmnCode = process.env.vnp_TmnCode;
            const vnp_HashSecret = process.env.vnp_HashSecret;
            const vnp_Url = process.env.vnp_Url;
            const vnp_Returnurl = BASE_URL + "paycourses/vnpay_post";
            const vnp_apiUrl = process.env.vnp_apiUrl;
            let ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            // Config input format
            // Expire
            const startTime = moment().tz("Asia/Ho_Chi_Minh");
            const expire = startTime.clone().add(15, "minutes");
            const formattedStartTime = startTime.format("YYYYMMDDHHmmss");
            const formattedExpire = expire.format("YYYYMMDDHHmmss");
            // thanh toan bang vnpay
            const vnp_TxnRef = Date.now().toString(); // Mã đơn hàng
            const vnp_OrderInfo = "Pay";
            const vnp_OrderType = "billpayment";
            const vnp_Amount = tongtien * 100;
            const vnp_Locale = "vn";
            const vnp_BankCode = "NCB";
            const vnp_IpAddr = "127.0.0.1";
            const vnp_ExpireDate = formattedExpire;

            const inputData = {
                vnp_Version: "2.1.0",
                vnp_TmnCode: vnp_TmnCode,
                vnp_Amount: vnp_Amount,
                vnp_Command: "pay",
                vnp_CreateDate: formattedStartTime,
                vnp_CurrCode: "VND",
                vnp_IpAddr: vnp_IpAddr,
                vnp_Locale: vnp_Locale,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_OrderType: vnp_OrderType,
                vnp_ReturnUrl: vnp_Returnurl,
                vnp_TxnRef: vnp_TxnRef,
                vnp_ExpireDate: vnp_ExpireDate,
            };
            if (vnp_BankCode) {
                inputData["vnp_BankCode"] = vnp_BankCode;
            }
            // const sortedInputData = Object.keys(inputData)
            //     .sort()
            //     .reduce((obj, key) => {
            //         obj[key] = inputData[key];
            //         return obj;
            //     }, {});
            const redirectUrl = new URL(vnp_Url);
            let query = "";
            let hashdata = "";
            Object.entries(inputData)
                .sort(([key1], [key2]) =>
                    key1.toString().localeCompare(key2.toString())
                )
                .forEach(([key, value], index) => {
                    if (
                        !value ||
                        value === "" ||
                        value === undefined ||
                        value === null
                    ) {
                        return;
                    }
                    redirectUrl.searchParams.append(key, value.toString());
                });
            let vnp_UrlWithQuery = vnp_Url + "?" + query;
            if (vnp_HashSecret) {
                const hmac = crypto.createHmac("sha512", vnp_HashSecret);
                const vnpSecureHash = hmac
                    .update(
                        Buffer.from(
                            redirectUrl.search.slice(1).toString(),
                            "utf8"
                        )
                    )
                    .digest("hex");
                redirectUrl.searchParams.append(
                    "vnp_SecureHash",
                    vnpSecureHash
                );
            }
            //console.log("vnp_UrlWithQuery:", redirectUrl);
            const returnData = {
                code: "00",
                message: "success",
                data: vnp_UrlWithQuery,
            };
            return redirectUrl;
        } catch (error) {
            console.error("Error in vnPay:", error);
            return res.status(500).json({
                message: "An error occurred while processing your payment.",
            });
        }
    },
    vnpayPost: async (req, res) => {
        const vnp_HashSecret = process.env.vnp_HashSecret; // Secret key từ VNPay
        const inputData = req.query; // Lấy tham số từ URL callback

        const vnp_SecureHash = inputData["vnp_SecureHash"]; // Lấy SecureHash
        delete inputData["vnp_SecureHash"]; // Loại bỏ trước khi kiểm tra chữ ký

        const sortedInputData = Object.keys(inputData)
            .sort()
            .reduce((obj, key) => {
                obj[key] = inputData[key];
                return obj;
            }, {});

        let hashdata = "";
        Object.keys(sortedInputData).forEach((key, index) => {
            if (index === 0) {
                hashdata += `${key}=${sortedInputData[key]}`;
            } else {
                hashdata += `&${key}=${sortedInputData[key]}`;
            }
        });

        const secureHash = crypto
            .createHmac("sha512", vnp_HashSecret)
            .update(hashdata)
            .digest("hex");

        // Kiểm tra chữ ký
        if (secureHash === vnp_SecureHash) {
            // Kiểm tra mã giao dịch
            if (inputData["vnp_ResponseCode"] === "00") {
                // Thanh toán thành công
                const payment = new Payment({
                    userId: userId,
                    items: courses,
                    total: courses.reduce(
                        (sum, course) => sum + parseFloat(course.Price),
                        0
                    ),
                    status: "paid",
                });

                await payment.save();

                // Xóa các khóa học khỏi bảng Cart
                await Cart.updateOne(
                    { userId: userId },
                    {
                        $pull: {
                            items: { $in: courses.map((course) => course._id) },
                        },
                    }
                );
                return res.render("pages/paycourses", {
                    title: "Payment",
                    isLoggedIn: true,
                    paidCourses: [], // Giỏ hàng trống
                    total: 0,
                    rollback: true,
                    code: inputData["vnp_ResponseCode"],
                    success: true,
                    message: "Giao dịch thành công!",
                });
                // Thực hiện cập nhật trạng thái đơn hàng trong DB
            } else {
                // Thanh toán thất bại
                return res.render("pages/paycourses", {
                    title: "Payment",
                    isLoggedIn: true,
                    paidCourses: [], // Giỏ hàng trống
                    total: 0,
                    rollback: true,
                    code: inputData["vnp_ResponseCode"],
                    success: false,
                    message: "Giao dịch thất bại!",
                });
            }
        } else {
            // Chữ ký không hợp lệ
            return res.render("pages/paycourses", {
                title: "Payment",
                isLoggedIn: true,
                paidCourses: [], // Giỏ hàng trống
                total: 0,
                rollback: true,
                code: inputData["vnp_ResponseCode"],
                success: false,
                message: "Chữ ký không hợp lệ!",
            });
        }
    },
};

module.exports = PaymentService;
