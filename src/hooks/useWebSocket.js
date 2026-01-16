const createPayload = (event, data = null) => {
    const payload = {
        action: "onchat",
        data: {
            event: event
        }
    };
    if (data) {
        payload.data.data = data;
    }
    return payload;
};

export const SocketRequests = {
    
    // 1. Đăng ký
    register: (user, pass) => createPayload("REGISTER", { user, pass }),

    // 2. Đăng nhập
    login: (user, pass) => createPayload("LOGIN", { user, pass }),

    // 3. Đăng nhập lại (khi có code)
    reLogin: (user, code) => createPayload("RE_LOGIN", { user, code }),

    // 4. Đăng xuất
    logout: () => createPayload("LOGOUT"),

    // --- ROOM ACTIONS ---

    // 5. Tạo phòng chat
    createRoom: (roomName) => createPayload("CREATE_ROOM", { name: roomName }),

    // 6. Tham gia phòng
    joinRoom: (roomName) => createPayload("JOIN_ROOM", { name: roomName }),

    // --- MESSAGES & HISTORY ---

    // 7. Lấy lịch sử chat phòng (Mặc định page 1 nếu không truyền)
    getRoomMessages: (roomName, page = 1) => 
        createPayload("GET_ROOM_CHAT_MES", { name: roomName, page }),

    // 8. Lấy lịch sử chat riêng (người với người)
    getPeopleMessages: (personName, page = 1) => 
        createPayload("GET_PEOPLE_CHAT_MES", { name: personName, page }),

    // 9. Gửi tin nhắn vào PHÒNG
    sendToRoom: (roomName, message) => 
        createPayload("SEND_CHAT", { type: "room", to: roomName, mes: message }),

    // 10. Gửi tin nhắn cho NGƯỜI
    sendToPeople: (personName, message) => 
        createPayload("SEND_CHAT", { type: "people", to: personName, mes: message }),

    // --- USER UTILS ---

    // 11. Kiểm tra user có online không
    checkUserOnline: (user) => createPayload("CHECK_USER_ONLINE", { user }),

    // 12. Kiểm tra user có tồn tại không
    checkUserExist: (user) => createPayload("CHECK_USER_EXIST", { user }),

    // 13. Lấy danh sách tất cả user online
    getUserList: () => createPayload("GET_USER_LIST")
};
