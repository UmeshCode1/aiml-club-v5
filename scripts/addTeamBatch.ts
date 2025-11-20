/**
 * Batch add team members from inline CSV (provided by user).
 * Usage: npx ts-node scripts/addTeamBatch.ts
 */
import dotenv from 'dotenv';
// Node 18+ has global fetch; no import needed.
dotenv.config({ path: '.env.local', override: true });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const teamCollectionIdRaw = process.env.NEXT_PUBLIC_COLLECTION_TEAM;
const teamCollectionId = (!teamCollectionIdRaw || teamCollectionIdRaw === 'TBD') ? 'auto_1763586573960_ec75mk' : teamCollectionIdRaw;
const apiKey = process.env.APPWRITE_API_KEY!;

if (!endpoint || !project || !databaseId || !teamCollectionId || !apiKey) {
  console.error('Missing env variables.');
  process.exit(1);
}
// After resolving fallback, proceed; no TBD possible now.

const RAW = `Name,Role,Phone,Email,Category,Profile Image URL\nVishal Kumar,President,6299200082,,Core Council,\nUmesh Patel,Vice President,7974389476,,Core Council,\nKinshuk Verma,Tech Lead,9084359829,,Technical,\nArnav Singh,Developer,8234099782,arnavsingh67@gmail.com,Technical,https://storage.tally.so/private/resized.jpg?id=XRZEqd&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlhSWkVxZCIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzEzNDk0OH0.DFOLuzgqskpnlbS4MJt6Nu_mcjQXSbbmGrfKCN7EzrM&signature=bf44483441231b00a1abb1ebafa9570fe59f1c23258b84782d2204461cb68976\nNimisha Kumari,Developer,8982849203,nimishakum511@gmail.com,Technical,https://storage.tally.so/private/20241208_163120.jpg?id=o0Xd6N&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im8wWGQ2TiIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzEzNTI5N30.dsSS1Qaby72C_qeRR0zWHcuF9prQWlUmhOaMlK0Hlu0&signature=c7f313bbca537d4fae68fad17e49ab4f10cdf4ee2a6b874628d4e17afaa77e9d\nJitesh Verma,Developer,8817683880,jiteshverma139@gmail.com,Technical,https://storage.tally.so/private/IMG_20250912_151311.jpg?id=JVaO7o&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpWYU83byIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzI1OTgxNn0.ncJ-oHniWSLbmhzY8tP7r9Lumeh8hoZqfsiiVee4Wc8&signature=7f0967e6a895b9dd0f0474e6145cad1cd4235a79300c8d9c55e0c8255df2895b\nHimanshu Singh,Developer,8815218904,singhhimanshu9893@gmail.com,Technical,https://storage.tally.so/private/IMG_20251117_141437.jpg?id=GYv5qk&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkdZdjVxayIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzM2OTIwN30.klQK6lWbb92yIeMSiE2aoYZ1HPnZy1O_Ny92NeeRj-c&signature=5d5b9cfe05cd8f957be03c31bdce20e3ea28b47ece91e3ec117a5a30afef5e30\nAarchi Sharma,Event Head,6266091145,,Events,\nParul Ajit,Event Head,8602691174,,Events,\nGourav Jain,Event Head,8878094508,,Events,\nTanu Jadon,Event Coordinator,6264052784,tanu05624@gmail.com,Events,https://storage.tally.so/private/IMG_20251114_210452.jpg?id=1bqMlM&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFicU1sTSIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzEzNTcwMX0.sGsEjdYCCeIoSTG7peuM2dmEpO_elUqFnZ6TpXTsLKA&signature=03eb6cd56a5a24d618949e8205091df96ef67b5cf5767e44de654c36ec1f25de\nSarvesh Sejwar,Event Coordinator,9329441246,aimlsarveshsejwar01@gmail.com,Events,https://storage.tally.so/private/WhatsApp-Image-2025-02-08-at-7.08.13-PM.jpeg?id=p4xWOV&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InA0eFdPViIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzM1OTcwNX0.f4UoVll-yImc8tHlF218ydPL1xYVwqBQtBTMd-7WXlw&signature=77eb5e1c6bd584c1e060e9a60f9c88416f32eecbcc67e4dd30fdb4a66af640ad\nNasir Khan,Event Coordinator,7898009433,mdnasir078667@gmail.com,Events,https://storage.tally.so/private/nasir-photo.jpg?id=p4xE18&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InA0eEUxOCIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzM4MzEwNH0.3ODULRX8o48-d9nDrKqVFQnX5ZC0tqAB-wusyAUT5Qg&signature=2f67416d7f6165f0455ea7cbbafc5ad487427ff54d1cdfebb0869ee7c5ebd5ec\nAnjali Sonare,Event Coordinator,9201724696,anjalisonare780@gmail.com,Events,https://storage.tally.so/private/Screenshot_2025-11-18-11-08-03-29_7fdf0a3dcb4b6a9498da2bb268ec2666~2.jpg?id=R8WP9j&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlI4V1A5aiIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzQ0NDQ5M30.QOfqXK-XENcaNFLjm10AessasrjPKjh98Rhn6E9KYfM&signature=69d4577c3401a44d19326d2f9991e100b1674cdfd5b0edc09c9b3ddc8bc2bbba\nAanya Tomar,Event Coordinator,,,Events,\nBhavesh Singh,Event Coordinator,,,Events,\nPrakhar Sahu,Media Relations Head,9584060146,prakharsahu150@gmail.com,Media & PR,https://storage.tally.so/private/Passport-size.jpg?id=j012Y1&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImowMTJZMSIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzE1MDA0Mn0.Q1seFwz1HntSJQSsr0Y-dMmvGtMt3wB1h8cE53dGqPk&signature=abdb6536fd0de18b7d6a90217c81c1c09fca7be0120984dbfed10d85422fc4f5\nKhushi Kumari,Media Head,8789498277,,Media & PR,\nArpit Mistrel,Media Team,9334030602,,Media & PR,\nAashu Kumar,Media Associate,8102823110,kaviraj07310731@gmail.com,Media & PR,https://storage.tally.so/private/IMG_20241007_190212.jpg?id=WeGVyJ&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IldlR1Z5SiIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzM1NTE0OH0.EQEwQ1zpoLkhWcDUOxrnKTRYceURfnr4REhvN-vLiPE&signature=51bcfdb01b3afff25220d7b693ece10545041814b083a43b849ecee5ca03b019\nDaksh Sahni,Editor / Media,9696532552,dakshsahni2006@gmail.com,Creative,https://storage.tally.so/private/IMG-20251007-WA0017.jpg?id=WevXXQ&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IldldlhYUSIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzIyMjU1OH0.MFp5Rk6stw8TBTGAu_E4XhQ4VzBzS0_RY36XqcB7NUE&signature=c4ac5c73fbc58d3052314db79992d1191ec1c80ea03271848b1274d1a0b3a2c2\nHana Nafees Abbasi,Editor / Media,7909796744,abbasihana16@gmail.com,Creative,https://storage.tally.so/private/IMG-20250817-WA0016.jpg?id=YoLbP5&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IllvTGJQNSIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzIyMzA1NX0.buEnWZ4Pog32oI--dCgUjIADfe6bsjkAePyIxfjKpXI&signature=95f88470c457e5fd8b0e04c09871e0a943d909ed9ddf6f3443358f4d3c4aaa06\nAbhijeet Sarkar,Editor Head,9111900236,,Creative,\nPritish Mandal,Editor,7067963041,,Creative,\nPrince Kumar,Discipline Head,9470280758,,Operations,\nHeer,Stage Lead Head,8966061631,,Operations,\nAnshul Sharma,Stage Lead Head,6263941427,,Operations,\nAvni Rawat,Anchor/Host,8450896733,avnir361@gmail.com,Operations,https://storage.tally.so/private/WhatsApp-Image-2025-11-15-at-21.05.25_75a17e8a.jpg?id=o04a51&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im8wNGE1MSIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzIyMjI5Mn0.uzBBX_QYY7-9UvVofOhO_BBGkRMP_nPj_bVdTpuZDqI&signature=296d03aefeb712ec48a1f08083c8172084cc93de6a07e6a240336bf66099cbb6\nAnkit Sharma,Anchor/Host,7724904911,ankitsharma60784@gmail.com,Operations,https://storage.tally.so/private/Snapchat-1114832638.jpg?id=k0MWeo&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImswTVdlbyIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzEzNTQ3N30.4iWyuB9Chpz5PBAB64VIcqtT5pR1S-JOoncoK6nkGWQ&signature=85db176fda31635b7706bfdcc052f50515bf4fb2aebb07b0e6a47e211aa1f1fe\nAnushka Malviya,Anchor/Host,9752099722,anushkamalviya93@gmail.com,Operations,https://storage.tally.so/private/Screenshot_2025_1114_212508.jpg?id=r0zL12&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InIwekwxMiIsImZvcm1JZCI6IjdSUlg3OSIsImlhdCI6MTc2MzEzODE0MX0.PB-c1qs-oEuFywBTUCB-k7WQtyVnXXUXjWFMnGpS7lo&signature=08b38eae203162d5cacc26731dc6e90f1889a821d1dbbc8871e55e3802210d61\nApurvi Agarwal,Anchor/Host,,,Operations,\nShambhavi,Anchor/Host,,,Operations,`;

interface Member { name:string; role:string; phone?:string; email?:string; category?:string; image?:string; }

function parse(): Member[] {
  const [header, ...rows] = RAW.split(/\r?\n/).filter(l => l.trim().length);
  return rows.map(r => {
    const [name, role, phone, email, category, image] = r.split(',');
    return { name: name?.trim(), role: role?.trim(), phone: phone?.trim(), email: email?.trim(), category: category?.trim(), image: image?.trim() };
  }).filter(m => m.name && m.role);
}

function mapCategory(role: string, cat?: string): string {
  const c = (cat||'').toLowerCase();
  if (c.includes('core')) return 'leadership';
  if (c.includes('technical')) return 'tech';
  if (c.includes('event')) return 'event_heads';
  if (c.includes('media')) return 'media';
  if (c.includes('creative')) return 'editors';
  if (c.includes('operations')) return role.toLowerCase().includes('discipline')? 'discipline':'stage';
  if (role.toLowerCase().includes('president') || role.toLowerCase().includes('vice')) return 'leadership';
  if (role.toLowerCase().includes('head')) return 'event_heads';
  return 'tech';
}

async function api(method: string, path: string, body?: any) {
  const res = await fetch(endpoint + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
      'X-Appwrite-Key': apiKey
    },
    body: body? JSON.stringify(body): undefined
  });
  const text = await res.text();
  let data: any = null; try { data = text? JSON.parse(text): null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text}`);
  return data;
}

async function exists(name: string, role: string) {
  try {
    const q = encodeURIComponent(`search("${name}")`);
    const r = await api('GET', `/databases/${databaseId}/collections/${teamCollectionId}/documents?queries[]=${q}`);
    return r.documents?.some((d: any) => d.name === name && d.role === role);
  } catch { return false; }
}

let orderStart = 1;
async function initOrder() {
  try {
    const r = await api('GET', `/databases/${databaseId}/collections/${teamCollectionId}/documents`);
    orderStart = (r.total || 0) + 1;
  } catch {/* keep default */}
}

async function add(member: Member) {
  if (await exists(member.name, member.role)) {
    console.log(`Skip (exists): ${member.name} (${member.role})`);
    return;
  }
  // Use member name (lowercase, no spaces) as photoId
  const photoId = member.name ? member.name.replace(/\s+/g, '').toLowerCase() : '';
  const body = {
    documentId: 'unique()',
    data: {
      name: member.name,
      role: member.role,
      category: mapCategory(member.role, member.category),
      bio: '',
      photoId,
      instagram: '',
      linkedin: '',
      github: '',
      email: member.email || '',
      order: orderStart++
    },
    permissions: ['read("any")']
  };
  await api('POST', `/databases/${databaseId}/collections/${teamCollectionId}/documents`, body);
  console.log(`Added: ${member.name} (${member.role}) with photoId: ${photoId}`);
}

(async () => {
  try {
    await initOrder();
    const members = parse();
    console.log('Parsed members:', members.length, 'Starting order at', orderStart);
    for (const m of members) {
      await add(m);
    }
    console.log('Batch completed.');
  } catch (e:any) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
})();
