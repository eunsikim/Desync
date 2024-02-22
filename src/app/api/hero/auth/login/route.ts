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
        const hero = await query({
            query: `SELECT * FROM hero WHERE email = ?;`,
            values: [email],
        });
    
        const hashedPass = hero[0].password;
        
        if(bcrypt.compareSync(password, hashedPass)){
            const { id, first_name, last_name, email } = hero[0]

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