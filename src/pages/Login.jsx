import React from 'react'

export const Login = () => {
  return (
    <>
    <div className="form-row">
        <div className="form-container img-bg">
            <h2>Welcome to Meet App!</h2>
            <hr />
            <p>Connecting you, anytime, anywhere!</p>
        </div>
        <div className="form-container register-form">
            <div className="form-wrapper">
            <h1 className="logo-responsive">Meet-up</h1>
                <span className="title">Sign In</span>
                <form>
                    <input type="email" placeholder="Enter your email" />
                    <input type="password" placeholder="Enter your password" />
                    <button>Sign In</button>
                </form>
                <p>Don't have an account yet? Register here.</p>
            </div>
        </div>
    </div>
    </>
  )
}
