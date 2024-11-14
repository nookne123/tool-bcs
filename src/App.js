import './App.css';
import {useState} from "react";

function App() {
  const [inputLog, setInputLog] = useState('');
  const [outPutGetInteractive, setOutPutGetInteractive] = useState('');
  const [outPutGetUsageDetail, setOutPutGetUsageDetail] = useState('');
  const [outPutGetInteractiveMsg, setOutPutGetInteractiveMsg] = useState('');
  const [outPutGetUsageDetailMsg, setOutPutGetUsageDetailMsg] = useState('');

  const lines = inputLog.split('\n'); // แบ่ง inputLog เป็น array ของแต่ละบรรทัด

  const handleConvert = () => {
    let interactiveOutput = '';
    let usageDetailOutput = '';
    let interactiveOutputMsg = '';
    let usageDetailOutputMsg = '';

    lines.forEach(line => {
      try {
        const log = JSON.parse(line); // แปลงบรรทัดเป็น JSON
        // ตรวจสอบว่าบรรทัดตรงกับเงื่อนไขหรือไม่
        if (log.actionDescription && log.actionDescription.includes('receive http response from getInteractiveBillDet')) {
          if (log.message === "" || log.message === null) {
            log.message = 'ไม่มีค่า';
          } else {
            interactiveOutputMsg = log.message;
            log.message = 'ดูค่าข้างล่างนะจ๊ะ';
          }
          interactiveOutput += formatJSON(log) + '\n'; // แสดงผลลัพธ์
        }
        if (log.actionDescription && log.actionDescription.includes('receive http response from GetUsageDeTail')) {
          usageDetailOutputMsg = log.message;
          if (log.message === "" || log.message === null) {
            log.message = 'ไม่มีค่า';
          } else {
            interactiveOutputMsg = log.message;
            log.message = 'ดูค่าข้างล่างนะจ๊ะ';
          }
          usageDetailOutput += formatJSON(log) + '\n'; // แสดงผลลัพธ์
        }
      } catch (error) {
        console.error('Error parsing line:', line);
      }
    });

    // อัปเดตผลลัพธ์
    setOutPutGetInteractive(interactiveOutput);
    setOutPutGetUsageDetail(usageDetailOutput);
    setOutPutGetInteractiveMsg(interactiveOutputMsg);
    setOutPutGetUsageDetailMsg(usageDetailOutputMsg);
  };

  const handleReset = () => {
    setInputLog('');
    setOutPutGetInteractive('');
    setOutPutGetUsageDetail('');
    setOutPutGetInteractiveMsg('');
    setOutPutGetUsageDetailMsg('');
  };

  // ฟังก์ชันที่ใช้ในการจัดรูปแบบ JSON ให้อ่านง่าย
  const formatJSON = (jsonObj) => {
    return JSON.stringify(jsonObj, null, 2);
  };

  return (
    <div className="text-center p-10 px-48">
      <div className="py-4 font-bold text-6xl text-black">Unpack message</div>
      <div className="py-10 font-bold text-4xl text-yellow-300">Input Text</div>
      <textarea
        type="text"
        value={inputLog}
        onChange={(e) => setInputLog(e.target.value)}
        className="border rounded border-black p-2 w-full h-[250px]"
      />
      <div className="flex justify-center mt-5 gap-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleConvert}
        >
          Convert
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="py-10 mt-10 font-bold text-4xl text-purple-700">Output</div>

      <div className="font-bold text-xl text-black text-start">Get Interactive Response</div>
      <textarea
        type="text"
        value={outPutGetInteractive}
        readOnly
        className="border rounded border-black p-2 w-full h-[300px]"
      />
      <div className="font-bold text-xl text-black text-start py-4">message in xml Get Interactive</div>
      <textarea
        className="w-full h-[500px]"
        value={outPutGetInteractiveMsg}
        readOnly
      />
      <div className="font-bold text-xl text-black text-start mt-10">Get UsageDetail Response</div>
      <textarea
        type="text"
        value={outPutGetUsageDetail}
        readOnly
        className="border rounded border-black p-2 w-full h-[300px]"
      />
      <div className="font-bold text-xl text-black text-start py-4">message in xml Get UsageDetail</div>
      <textarea
        className="w-full h-[500px] "
        value={outPutGetUsageDetailMsg} // ใช้ค่าจากสถานะ
        readOnly
      />

    </div>
  );
}

export default App;
