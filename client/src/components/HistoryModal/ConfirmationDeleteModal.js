export default function ConfirmationDeleteModal(props){
    return (
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">
                <p>Are you sure you want to delete this item?</p>
                <div className="delete-cancelDelete-container">
                    <button onClick={props.onConfirm}>Confirm</button>
                    <button onClick={props.onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}