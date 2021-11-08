import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Pagination} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {offsetAction} from "../../../store/actionCreators";

function Paginator(props) {

    const dispatch = useDispatch()

    let offset = (offset, currentPage) =>{
        dispatch(offsetAction(offset, currentPage))
    }

    return (
        <div className="App">
            <Pagination className="pagination justify-content-center">
                <Pagination.Item className={Number(props.offset) === 0 ? 'disabled': ''}
                    onClick={() => {
                        offset(0, 1);
                    }}>
                        Перша
                </Pagination.Item>

                <Pagination.Item className={Number(props.currentPage) === 1 ? 'disabled': ''}
                    onClick={() => {
                        offset(props.offset ? props.offset - props.limit : 0, props.currentPage - 1);
                    }}>
                        &laquo;
                </Pagination.Item>

                {props.listNumber.map(e => (
                    <Pagination.Item key={e}
                                     className={Number(props.currentPage) === e ? 'active': ''}
                                     onClick={() => {
                                         offset(props.limit * (e - 1), e);
                                     }}>
                        {e}
                    </Pagination.Item>
                ))}

                <Pagination.Item className={Number(props.currentPage) === props.totalNumber ? 'disabled': ''}
                    onClick={() => {
                        offset(Number(props.offset) + Number(props.limit), props.currentPage + 1);
                    }}>
                        &raquo;
                </Pagination.Item>

                <Pagination.Item className={Number(props.currentPage) === props.totalNumber ? 'disabled': ''}
                    onClick={() => {
                        offset((props.totalNumber - 1) * props.limit, props.totalNumber);
                    }}>
                        Остання
                </Pagination.Item>
            </Pagination>

        </div>
    );
}

export default React.memo(Paginator);