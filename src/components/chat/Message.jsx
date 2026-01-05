import { useState } from "react";
import Sidebar from '../sidebar/sidebar';
import ListMess from "./messagelist/ListMess";

function Message() {

    const [filter, setFilter] = useState('all');
    const users = ListMess.users;
    const handleFilterChange = (selectedFilter) => {
        if (users.type === 0) {
            selectedFilter('all');
        } else if (users.type === 1) {
            selectedFilter('room');
        }
        console.log(`Filter changed to: ${selectedFilter}`);

    }

    return (
        <div className="d-flex">
            {/* Truyền hàm xuống Sidebar */}
            <Sidebar onFilterChange={handleFilterChange} />

            {/* Truyền giá trị lọc xuống ListMess để nó tự lọc hiển thị */}
            <ListMess filter={currentFilter} />
        </div>
    );
}