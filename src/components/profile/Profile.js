import "./Profile.css"

const Profile = ({ setPage }) => {

    return (
        <div
            className="profile-main"
            // style={{
            //     backgroundImage: `url(${process.env.PUBLIC_URL + '/neon_bg.jpg'})`,
            //     backgroundSize: 'fit',
            //     backgroundPosition: 'center',
            // }}
            >
            Name is Faran
            <button onClick={() => setPage(2)}>Click me</button>
        </div>
    )

}

export default Profile;