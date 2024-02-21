import { NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import bcrypt from 'bcrypt';


export async function POST(req: Request){
    const body = await req.json();

    const { email, password } = body

    // All fields required check
    if(!email?.trim() || !password?.trim()){
        return NextResponse.json({
            message: 'All fields are required and cannot be empty.',
        }, {
            status: 400,
            headers: {
                'Content-Type': 'application.json'
            }
        }); 
    }

    try{
        // Get hero row
        const hero = await query({
            query: `SELECT * FROM hero WHERE email = ?;`,
            values: [email],
        });
    
        const hashedPass = hero[0].password;
        
        // Check password input and hashed password (in hero row)
        if(bcrypt.compareSync(password, hashedPass)){
            const { id, first_name, last_name, email } = hero[0]
            console.info(`Login Successful`);
            return NextResponse.json({ 
                message: "Login Successful",
                hero: { id, first_name, last_name, email }
            }, 
            {
                status: 200,
                headers: {
                    'Content-Type': 'application.json'
                }
            });
        }
        else{
            // Incorrect password
            console.info(`Incorrect password`);
            return NextResponse.json({ 
                message: "Incorrect password",
                hero: { email, password }
            }, 
            {
                status: 401,
                headers: {
                    'Content-Type': 'application.json'
                }
            });
        }
    }
    catch(err){
        console.error('Error loging in');

        let message = 'Email does not exist';
        let status = 401;

        return NextResponse.json({
            error_code: err.code,
            message: message,
            error_number: err.errno
        }, {
            status: status,
            headers: {
                'Content-Type': 'application.json'
            }
        });
    }
}