import {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";

async function getUsers(){
    const response = await fetch('http://localhost:8000/users');
    const data = await response.json();
    return data;
}

async function postUsers(user){
    const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json,'
                 },
                 body: JSON.stringify(user)
    });

}
export function UsersPage() {

    const [users, setUsers] = useState([]);
    const [update, setUpdate] = useState(false);


    const [showModal, setShowModal] = useState(false);

    const [deletedUserId, setDeletedUserId] = useState(null);


    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setDeletedUserId(null);
    }



    const {register,
           handleSubmit,
           reset} = useForm()

    useEffect(() => {
        (async function (){
            const data = await getUsers()
            setUsers(data)
        })()
    }, [update]);

    function submit(values){
        console.log(values)
        reset()
        postUsers(values)
        openModal();
        setUpdate(!update)
    }

   async function deleteUser(id){
        const response = await fetch(`http://localhost:8000/users/${id}`, {
            method: 'DELETE',
        })
        setUpdate(!update);
       setDeletedUserId(id);
       openModal();
    }



    async function updateUser(id, values){
        const response = await fetch(`http://localhost:8000/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            setUpdate(!update)
        reset()
    }


    return (
        <div>
            <h1>Users list</h1>


            <form onSubmit={handleSubmit(submit)}>
                <input type="text" placeholder="name" {...register('name')}/>
                <input type="text" placeholder="username" {...register('username')}/>
                <input type="text" placeholder="email" {...register('email')}/>
                <input type="text" placeholder="website" {...register('website')}/>
                <button>create user</button>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}><button>close</button></span>
                            <p>пользователь добавлен!</p>
                        </div>
                    </div>
                )}
            </form>

                <table>
                    <thead>
                         <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Website</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.website}</td>
                                <td>
                                    <button onClick={() => deleteUser(user.id)}>delete</button>
                                    {showModal && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeModal}><button>close</button></span>
                                                {deletedUserId && <p>Пользователь удален!</p>}
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={handleSubmit((values) => updateUser(user.id, values))}>update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

