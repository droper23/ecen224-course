/* Shared Game 2 question bank, used by game2-questions.html and game2-practice-test.html. */
const C = String.raw;
const T = (heads, rows) => '<table class="qb-tbl"><tr>' + heads.map(h => '<th>' + h + '</th>').join('') + '</tr>' + rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>';
const SIX_REG = ['%esp', '%ebp', '%rip', '%rax', '%rsp', '%rdx'];
const STACK8 = ['0x21F8', '0x2200', '0x2202', '0x2208', '0x2210', '0x2226', '0x2234', 'Unknown'];
const REGSET8 = ['%rax', '%rbx', '%rcx', '%rdx', '%rsi, %rdi', '%rbp, %rsp', '%r8 &ndash; %r11', '%r12 &ndash; %r15'];

/* Item kinds:
   {sec, title, src}                  -> section header
   {block, html, code}                -> shared setup ("Beginning of block")
   {q, code, opts, a, exp}            -> multiple choice (a = index) / select-all (a = [indexes])
   {q, code, tf:true|false, exp}      -> true/false
   {q, code, fill:'answer', alt, exp} -> fill in the blank
*/
const BANK = [

/* ====================================================== 1 */
{sec:'s1', title:'1. Assembly introduction & the ISA', src:'Slides 17 (Assembly Introduction) &middot; HW11 Q2&ndash;3'},
{q:`Which x86-64 register is used to store the memory location of the next instruction?`, opts:SIX_REG, a:2,
 exp:`<p>The program counter (PC) is called <code>%rip</code> (instruction pointer) in x86-64. <code>%rsp</code> is the stack pointer. <code>%esp</code> and <code>%ebp</code> are the old 32-bit IA32 names. <code>%rax</code> holds return values.</p>`},
{q:`Which x86-64 register is used to store the stack pointer?`, opts:SIX_REG, a:4,
 exp:`<p><code>%rsp</code> always points to the top of the stack, which is the lowest used address. <code>%rbp</code> is an optional frame pointer, not the stack top. Watch for the 32-bit decoy <code>%esp</code>.</p>`},
{q:`The instruction set architecture (ISA) defines all of the following EXCEPT:`, opts:['The processor state (registers, word size)','The format of the instructions','The effect each instruction has on the processor state','Cache sizes, pipeline depth, and clock frequency','The set of instructions available to the programmer'], a:3,
 exp:`<p>Cache sizes, pipeline depth, and clock frequency belong to the <strong>microarchitecture</strong>, the implementation of the ISA, which software usually can't see. The ISA is what you need to know to write assembly: state, instruction format, and what each instruction does.</p>`},
{q:`Which file does <code>gcc -Og -S sum.c</code> produce?`, opts:['sum.i','sum.s','sum.o','a.out','sum.a'], a:1,
 exp:`<p><code>-S</code> stops after compiling to assembly, producing <code>sum.s</code>. Pipeline: preprocessor (<code>gcc -E</code>, .i) &rarr; compiler (<code>-S</code>, .s) &rarr; assembler (<code>as</code>, .o) &rarr; linker (<code>ld</code>, executable). <code>.a</code> is a static library.</p>`},
{q:`Which tool translates an assembly file (.s) into an object file (.o)?`, opts:['Preprocessor','Compiler','Assembler','Linker','Loader','Disassembler'], a:2,
 exp:`<p>The assembler encodes each instruction in binary. The resulting .o is a nearly complete image of the executable, but references between files (such as calls to <code>printf</code>) are not yet resolved. The linker resolves those.</p>`},
{q:`Object code (.o) has the addresses of global values already filled in.`, tf:false,
 exp:`<p><strong>False.</strong> Object code holds the binary instructions, but the addresses of global values are not yet filled in. The <em>linker</em> resolves references between files and adds static library code, producing executable code.</p>`},
{q:`Which of the following is NOT part of the programmer-visible state in x86-64?`, opts:['Program counter (%rip)','Register file','Condition codes','Memory (code, data, stack)','Cache memory'], a:4,
 exp:`<p>The programmer's view includes the PC, registers, condition codes (CF, ZF, SF, OF), and byte-addressable memory. Caches are a microarchitecture detail that assembly code can't see.</p>`},
{q:`Assembly language has aggregate data types such as arrays and structures.`, tf:false,
 exp:`<p><strong>False.</strong> Assembly only knows integer-like data of 1, 2, 4, or 8 bytes and floating point of 4, 8, or 10 bytes. Arrays and structs are just contiguously allocated bytes in memory, accessed through address arithmetic.</p>`},
{q:`How many bytes does an instruction with the suffix <code>l</code> (for example, <code>movl</code>) operate on?`, fill:'4', alt:'4 bytes (double word)',
 exp:`<p>Suffixes: <code>b</code> = byte (1), <code>w</code> = word (2), <code>l</code> = double word (4), <code>q</code> = quad word (8). Intel's "word" is 16 bits for historical reasons.</p>`},
{q:`x86-64 machine instructions can range in length from:`, opts:['Exactly 4 bytes each','1 to 4 bytes','1 to 8 bytes','1 to 15 bytes','2 to 16 bytes'], a:3,
 exp:`<p>x86-64 is CISC with variable-length instructions of 1&ndash;15 bytes. The encoding is designed so that, from a given starting position, the bytes decode into instructions in only one way. In <code>sumstore</code>, instructions were 1, 3, or 5 bytes (14 bytes total).</p>`},
{q:`Which command disassembles an executable file <code>p</code> so you can read its machine code as assembly?`, opts:['gcc -S p','objdump -d p','gdb -S p','as -d p','ld -d p','cat p'], a:1,
 exp:`<p><code>objdump -d</code> reconstructs approximate assembly from the byte sequences. In gdb, <code>disassemble sumstore</code> does the same, and <code>x/14b sumstore</code> examines 14 raw bytes.</p>`},
{q:`The disassembler may name instructions slightly differently than the compiler, for example by omitting the <code>q</code> suffix (<code>mov</code> instead of <code>movq</code>).`, tf:true,
 exp:`<p><strong>True.</strong> objdump output often shows <code>mov</code>, <code>push</code>, and <code>callq</code>/<code>retq</code> instead of the suffixes gcc emits. The disassembler infers the size from the encoding.</p>`},
{q:`The three kinds of operations assembly instructions perform are:`, opts:['Arithmetic/logic on register or memory data; transfer data between memory and registers; transfer control','Compile, assemble, and link','Load, store, and allocate structs','Push, pop, and print','Declare variables, define types, and call functions'], a:0,
 exp:`<p>Per the slides: (1) arithmetic and logic on register or memory data, (2) data transfer (load from memory into a register, store a register to memory), and (3) control transfer (unconditional jumps, conditional branches, procedure calls and returns).</p>`},

/* ====================================================== 2 */
{sec:'s2', title:'2. Registers, operand forms & mov', src:'Slides 18 (Move & Address) &middot; HW11 Q4&ndash;6, Q12&ndash;20'},
{block:'Move', n:3, html:`Assume <code>%rdi</code>, <code>%rsi</code>, and <code>%rdx</code> hold 5, 7, and 9. The following instructions run in order:`, code:C`movq %rsi, %rax
movq %rdi, %rsi
movq %rdx, %rdi
movq %rax, %rdx`},
{q:`What is the value (decimal) in <code>%rsi</code> after the instructions execute?`, fill:'5',
 exp:`<p>Trace one line at a time. %rax&larr;7, then %rsi&larr;%rdi=5, then %rdi&larr;%rdx=9, then %rdx&larr;%rax=7. <code>movq Src, Dest</code> copies left to right, and the source keeps its value.</p>`},
{q:`What is the value (decimal) in <code>%rdi</code>?`, fill:'9', exp:`<p><code>movq %rdx, %rdi</code> copies 9 into %rdi.</p>`},
{q:`What is the value (decimal) in <code>%rdx</code>?`, fill:'7', exp:`<p>%rax got the original %rsi (7) on line 1. Line 4 copies it into %rdx. This is the classic three-register rotate.</p>`},

{block:'Memory Address Mode', n:10, html:`Assume the following values are stored at the indicated memory addresses and registers. Answer with the <strong>hexadecimal value (no prefix)</strong> of each operand used as the <em>source</em> of a <code>movq</code>.<br>` + T(['Memory address','Value'],[['0x2000','0xA1'],['0x2004','0xB2'],['0x2008','0xC3'],['0x200C','0xD4'],['0x2010','0xE5']]) + T(['Register','Value'],[['%rax','0x2000'],['%rcx','0x0002'],['%rdx','0x0003']]) + `<br><em>HW11 lesson:</em> the table lists one value per address. Give the value stored at the computed address, not a string of bytes. Your HW11 misses (answers like CCDDEEFF) came from this.`},
{q:`<code>%rax</code>`, fill:'2000', exp:`<p>A register operand is just the register's contents: 0x2000. No memory access.</p>`},
{q:`<code>$0x2008</code>`, fill:'2008', exp:`<p><code>$</code> marks an <strong>immediate</strong>: the constant itself, 0x2008. No memory access.</p>`},
{q:`<code>0x2008</code>`, fill:'C3', exp:`<p>Without <code>$</code>, a number is an <strong>absolute memory address</strong>. The operand is M[0x2008] = 0xC3. A missing <code>$</code> is a classic trick.</p>`},
{q:`<code>(%rax)</code>`, fill:'A1', exp:`<p>Indirect: M[%rax] = M[0x2000] = 0xA1. This is like dereferencing a pointer in C (<code>*p</code>).</p>`},
{q:`<code>4(%rax)</code>`, fill:'B2', exp:`<p>Base + displacement: M[0x2000 + 4] = M[0x2004] = 0xB2.</p>`},
{q:`<code>14(%rax, %rcx)</code>`, fill:'E5', exp:`<p>The displacement is <strong>decimal</strong> 14 = 0xE. Address = 0x2000 + 0x2 + 0xE = 0x2010, so M[0x2010] = 0xE5. Convert decimal displacements before adding.</p>`},
{q:`<code>8199(%rcx, %rdx)</code>`, fill:'D4', exp:`<p>8199 decimal = 0x2007 (8192 = 0x2000). Address = 0x2007 + 0x2 + 0x3 = 0x200C, so M[0x200C] = 0xD4. HW11 used this same trick with <code>4106(%rcx,%rdx)</code>.</p>`},
{q:`<code>0x1FF4(, %rdx, 4)</code>`, fill:'A1', exp:`<p>No base register. Address = 0x1FF4 + 3&times;4 = 0x1FF4 + 0xC = 0x2000, so M[0x2000] = 0xA1. Form: D(Rb,Ri,S) = M[D + Rb + Ri&times;S].</p>`},
{q:`<code>(%rax, %rcx, 4)</code>`, fill:'C3', exp:`<p>Address = 0x2000 + 2&times;4 = 0x2008, so 0xC3.</p>`},
{q:`<code>-8(%rax, %rdx, 8)</code>`, fill:'E5', exp:`<p>Address = 0x2000 + 3&times;8 &minus; 8 = 0x2000 + 0x18 &minus; 0x8 = 0x2010, so 0xE5.</p>`},

{q:`Which of the following is a <strong>valid</strong> move instruction?`, opts:['movq (%rax), (%rdx)','movl %eax, $0x123','movb %al, %sl','movl %rax, (%rsp)','movw %dx, (%rax)','movb $0xF, (%ebx)'], a:4,
 exp:`<p><code>movw %dx,(%rax)</code> stores 2 bytes through a 64-bit address register, which is fine. The others: memory-to-memory isn't allowed in one instruction; an immediate can't be a destination; <code>%sl</code> doesn't exist (it's <code>%sil</code>); <code>movl</code> doesn't match the 64-bit <code>%rax</code>; and a 32-bit <code>%ebx</code> can't be an address register in x86-64.</p>`},
{q:`Why is <code>movw (%rax), 4(%rsp)</code> invalid?`, opts:['The destination is too small','Both the source and destination are memory references','The suffix does not match the register','An immediate cannot be a destination','%rsp cannot be used in an address','It is valid'], a:1,
 exp:`<p>x86-64 can't move directly from memory to memory. You need two instructions: load into a register, then store.</p>`},
{q:`Why is <code>movl %eax, %dx</code> invalid?`, opts:['The destination operand is the wrong size','Both operands are memory','%dx does not exist','An immediate is used as a destination','%eax cannot be a source','It is valid'], a:0,
 exp:`<p><code>movl</code> moves 4 bytes, but <code>%dx</code> is a 2-byte register. Both operands must match the suffix.</p>`},
{q:`Why is <code>movb %si, 8(%rbp)</code> invalid?`, opts:['Memory destinations are not allowed','The suffix (b) does not match the register (%si is 2 bytes)','%rbp cannot be used as a base','The displacement must be negative','%si does not exist','It is valid'], a:1,
 exp:`<p><code>%si</code> is the 16-bit (word) part of <code>%rsi</code>. A byte move would need <code>%sil</code>.</p>`},
{q:`<code>%rax = 0x1122334455667788</code>. After <code>movl $-1, %eax</code>, what is in <code>%rax</code> (hex, no prefix)?`, fill:'00000000FFFFFFFF', alt:'FFFFFFFF',
 exp:`<p><strong>Trick rule:</strong> any instruction that writes a <em>32-bit</em> register (e.g. <code>%eax</code>) <strong>zeroes the upper 32 bits</strong> of the 64-bit register. So %rax = 0x00000000FFFFFFFF.</p>`},
{q:`Same starting value <code>%rax = 0x1122334455667788</code>. After <code>movw $-1, %ax</code>, what is in <code>%rax</code>?`, fill:'112233445566FFFF',
 exp:`<p>Writes to 16-bit (<code>%ax</code>) and 8-bit (<code>%al</code>) registers <strong>leave the other bytes unchanged</strong>. Only 32-bit writes zero-extend. The slides call this out: "<code>movw $-1,%ax</code> moves 0xFFFF to %ax, high bytes in %rax untouched".</p>`},
{q:`Same starting value. After <code>movb $0, %al</code>, what is in <code>%rax</code>?`, fill:'1122334455667700',
 exp:`<p>Only the low byte changes, from 0x88 to 0x00.</p>`},
{q:`<code>%dl = 0x8A</code>. After <code>movzbq %dl, %rax</code>, what is in <code>%rax</code>?`, fill:'000000000000008A', alt:'8A',
 exp:`<p><code>movz</code> = zero-extend: the upper 7 bytes are filled with 0s. Suffix <code>bq</code> means byte to quad.</p>`},
{q:`<code>%dl = 0x8A</code>. After <code>movsbq %dl, %rax</code>, what is in <code>%rax</code>?`, fill:'FFFFFFFFFFFFFF8A',
 exp:`<p><code>movs</code> = sign-extend. 0x8A = 1000 1010, so the sign bit is 1 and the upper bytes fill with 1s (0xFF). As a signed char, 0x8A = &minus;118, and the extended value is still &minus;118.</p>`},
{q:`Which C statement matches <code>movq %rax, (%rdx)</code>, where %rax holds <code>temp</code> and %rdx holds pointer <code>p</code>?`, opts:['temp = *p;','*p = temp;','p = &amp;temp;','p = temp;','temp = p;'], a:1,
 exp:`<p>Parentheses on the destination mean a <strong>store</strong> to memory at address %rdx, so <code>*p = temp</code>. <code>movq (%rdx),%rax</code> would be the load, <code>temp = *p</code>.</p>`},
{q:`What does this function do? (%rdi = xp, %rsi = yp)`, code:C`movq (%rdi), %rax
movq (%rsi), %rdx
movq %rdx, (%rdi)
movq %rax, (%rsi)
ret`, opts:['Copies *xp into *yp only','Swaps the values pointed to by xp and yp','Swaps the pointers xp and yp','Returns *xp + *yp','Sets both *xp and *yp to *yp'], a:1,
 exp:`<p>This is <code>swap(long *xp, long *yp)</code>: t0=*xp; t1=*yp; *xp=t1; *yp=t0. It swaps the pointed-to values, not the pointers.</p>`},
{q:`Immediate operands in AT&amp;T syntax are written with a <code>$</code> prefix, like a C constant.`, tf:true,
 exp:`<p><strong>True.</strong> Examples: <code>$0x400</code>, <code>$-533</code>. Registers start with <code>%</code>, and memory references use <code>D(Rb,Ri,S)</code> syntax.</p>`},
{q:`In AT&amp;T syntax, for <code>movq A, B</code>, which operand is the destination?`, opts:['A','B','Whichever is a register','Whichever is in memory','It depends on the suffix'], a:1,
 exp:`<p>AT&amp;T order is <strong>source, destination</strong>. (Intel syntax reverses it, which is why online examples can confuse you.)</p>`},

/* ====================================================== 3 */
{sec:'s3', title:'3. leaq & address arithmetic', src:'Slides 18&ndash;19 &middot; HW11 Q7&ndash;11 &middot; HW12 Q12&ndash;13'},
{block:'Load Effective Address', n:6, html:`Assume <code>%rdi = 4</code>, <code>%rsi = 2</code>, <code>%rdx = 3</code>. What is the <strong>decimal</strong> value in <code>%rax</code> after each <code>leaq</code>?`},
{q:`<code>leaq 7(%rdx), %rax</code>`, fill:'10', exp:`<p>leaq computes the address expression and stores the <em>number</em>: 7 + 3 = 10. It never touches memory.</p>`},
{q:`<code>leaq (%rdi, %rsi), %rax</code>`, fill:'6', exp:`<p>4 + 2 = 6.</p>`},
{q:`<code>leaq (%rsi, %rsi, 4), %rax</code>`, fill:'10', exp:`<p>2 + 2&times;4 = 10. This is the compiler's trick for computing 5*x.</p>`},
{q:`<code>leaq 0x10(, %rdx, 8), %rax</code>`, fill:'40', exp:`<p>0x10 = <strong>16</strong> decimal. 16 + 3&times;8 = 40. Convert hex displacements.</p>`},
{q:`<code>leaq -3(%rdi, %rdx, 2), %rax</code>`, fill:'7', exp:`<p>4 + 3&times;2 &minus; 3 = 7.</p>`},
{q:`<code>leaq 5(%rsi, %rdi, 7), %rax</code> (computed the way HW11 did)`, fill:'35',
 exp:`<p>5 + 2 + 4&times;7 = 35. Note: real x86-64 only allows scale factors 1, 2, 4, and 8, so an assembler would reject a scale of 7. HW11 still graded it as plain arithmetic, so compute it literally if it shows up.</p>`},
{q:`<code>leaq</code> reads memory at the computed address.`, tf:false,
 exp:`<p><strong>False.</strong> leaq only computes the address expression and writes that value to the destination register. A <code>movq</code> with the same operand would read memory.</p>`},
{q:`<code>leaq</code> sets the condition codes.`, tf:false,
 exp:`<p><strong>False.</strong> The slides say condition codes are "not set by leaq instruction." So a jump after leaq uses the flags from an earlier arithmetic or compare instruction.</p>`},

{block:'Assembly to C (leaq)', n:3, html:`<code>scale(long x, long y, long z)</code>: x, y, z arrive in <code>%rdi, %rsi, %rdx</code>, and the return value is in <code>%rax</code>. It is called as <code>scale(1, 5, 2)</code>.`, code:C`scale:
  leaq (%rdi,%rsi), %rax
  leaq (%rdx,%rdx,2), %rdx
  leaq (%rax,%rdx,4), %rax
  ret`},
{q:`After the function completes, what is in <code>%rdx</code> (decimal)?`, fill:'6', exp:`<p>Line 2: %rdx = z + 2z = 3z = 6. Note that the argument register gets overwritten.</p>`},
{q:`What is the return value (decimal)?`, fill:'30', exp:`<p>%rax = x+y = 6. Then %rax = 6 + 4&times;(3z) = 6 + 24 = 30.</p>`},
{q:`Which C expression does <code>scale</code> compute?`, opts:['x + y + z','x + y + 3*z','x + y + 12*z','(x + y) * 12 * z','4*x + 4*y + 3*z'], a:2,
 exp:`<p>(x+y) + 4&middot;(3z) = x + y + 12z.</p>`},
{q:`Which <em>single</em> instruction computes <code>%rax = 9 * %rdi</code>?`, opts:['leaq (%rdi,8), %rax','leaq (%rdi,%rdi,8), %rax','leaq 9(%rdi), %rax','movq 9(%rdi), %rax','salq $9, %rdi','leaq (,%rdi,9), %rax'], a:1,
 exp:`<p>x + 8x = 9x. Scale 9 isn't legal, <code>9(%rdi)</code> is x+9, and the movq would read memory.</p>`},
{q:`<code>long *x</code> is in %rdi and <code>long i</code> is in %rsi. Which instruction computes <code>&amp;x[i]</code> into %rax?`, opts:['movq (%rdi,%rsi,8), %rax','leaq (%rdi,%rsi,8), %rax','leaq (%rdi,%rsi,4), %rax','leaq 8(%rdi,%rsi), %rax','movq (%rdi,%rsi), %rax'], a:1,
 exp:`<p>&amp;x[i] = x + 8i because a long is 8 bytes. <code>leaq</code> computes the address. <code>movq</code> with the same operand would load <code>x[i]</code> itself.</p>`},

/* ====================================================== 4 */
{sec:'s4', title:'4. Arithmetic, logic & shifts', src:'Slides 19 &middot; HW12 Q2&ndash;9, Q14&ndash;19'},
{block:'Arithmetic Operators', n:7, html:`Assume the following values (hex, no prefix) are stored:<br>` + T(['Address','Value'],[['0x100','FF'],['0x108','AB'],['0x110','13'],['0x118','11']]) + T(['Register','Value'],[['%rax','100'],['%rcx','1'],['%rdx','3']]) + `<br>After <strong>all</strong> of these execute, what are the new values (hex, no prefix)?`, code:C`addq  %rcx, (%rax)
subq  %rdx, 8(%rax)
incq  16(%rax)
addq  $2, (%rax,%rcx,8)
imulq %rdx, 24(%rax)
decq  %rcx
incq  %rdx
subq  %rdx, %rax`},
{q:`What is stored at 0x100?`, fill:'100', exp:`<p>M[0x100] = 0xFF + %rcx(1) = 0x100.</p>`},
{q:`What is stored at 0x108?`, fill:'AA', exp:`<p>Two instructions hit 0x108. <code>subq %rdx,8(%rax)</code> gives 0xAB&minus;3 = 0xA8. Then <code>addq $2,(%rax,%rcx,8)</code>: the address is 0x100 + 1&times;8 = 0x108 (%rcx is still 1 at that point), so 0xA8+2 = <strong>0xAA</strong>. Order matters.</p>`},
{q:`What is stored at 0x110?`, fill:'14', exp:`<p>incq: 0x13 + 1 = 0x14.</p>`},
{q:`What is stored at 0x118?`, fill:'33', exp:`<p>0x11 &times; 3 = 0x33. (Real x86-64 <code>imul</code> needs a register destination, but HW12 used a memory destination like this, so compute it literally.)</p>`},
{q:`What is stored in %rcx?`, fill:'0', exp:`<p>decq: 1 &minus; 1 = <strong>0</strong>. In HW12 you answered "CB" here and the key was 0. Don't confuse the register with memory.</p>`},
{q:`What is stored in %rdx?`, fill:'4', exp:`<p>incq: 3 + 1 = 4.</p>`},
{q:`What is stored in %rax?`, fill:'FC', exp:`<p><code>subq %rdx,%rax</code>: %rax = %rax &minus; %rdx = 0x100 &minus; 4 = 0xFC. It uses the <em>new</em> %rdx (4). Remember Dest = Dest &minus; Src.</p>`},

{block:'Arithmetic function', n:5, html:`<code>arith(long x, long y, long z)</code> is called as <code>arith(1, 2, 3)</code>.`, code:C`arith:
  leaq  (%rdi,%rsi), %rax
  addq  %rdx, %rax
  leaq  (%rsi,%rsi,2), %rdx
  salq  $4, %rdx
  leaq  4(%rdi,%rdx), %rcx
  imulq %rcx, %rax
  ret`},
{q:`After it completes, what is in %rax (decimal)?`, fill:'606', exp:`<p>t1 = x+y = 3; t2 = t1+z = 6; %rdx = 3y = 6; then 6&lt;&lt;4 = 96 (that's y*48); %rcx = x + 96 + 4 = 101; rval = 6 &times; 101 = <strong>606</strong>.</p>`},
{q:`What is in %rdx (decimal)?`, fill:'96', exp:`<p>3y = 6, shifted left by 4 (&times;16), gives 96.</p>`},
{q:`What is in %rcx (decimal)?`, fill:'101', exp:`<p>leaq 4(%rdi,%rdx) = 1 + 96 + 4 = 101.</p>`},
{q:`What is in %rsi (decimal)?`, fill:'2', exp:`<p>%rsi is only read, never written, so it still holds y = 2. HW12 asked exactly this kind of "unchanged register" question.</p>`},
{q:`Why does the compiler compute <code>y*48</code> with <code>leaq</code> + <code>salq</code> instead of <code>imulq $48</code>?`, opts:['imulq cannot take an immediate','Shifts and adds are cheaper than a multiply','salq preserves the sign better','To set the condition codes','It is required by the calling convention'], a:1,
 exp:`<p>48y = (3y)&lt;&lt;4, and lea/shift are faster than an integer multiply. This is a form of reduction in strength.</p>`},

{q:`What is in %rdi (decimal) after these two instructions?`, code:C`movq $5, %rdi
salq $3, %rdi`, fill:'40', exp:`<p>Shifting left by k multiplies by 2<sup>k</sup>: 5 &times; 8 = 40.</p>`},
{q:`<code>%rax = -16</code>. After <code>sarq $2, %rax</code>, what is in %rax (decimal)?`, fill:'-4', exp:`<p><strong>Arithmetic</strong> right shift copies the sign bit, so &minus;16 / 4 = &minus;4.</p>`},
{q:`<code>%rax = 0xFFFFFFFFFFFFFFF0</code>. After <code>shrq $2, %rax</code>, what is in %rax (hex, no prefix)?`, fill:'3FFFFFFFFFFFFFFC', exp:`<p><strong>Logical</strong> right shift fills with 0s. The top two bits become 00, and the 0xF0 low byte shifts to 0xFC. Compare with sarq on the same bits, which gives 0xFFFFFFFFFFFFFFFC (&minus;4).</p>`},
{q:`What is the difference between <code>sarq</code> and <code>shrq</code>?`, opts:['sarq shifts left; shrq shifts right','sarq fills vacated high bits with the sign bit; shrq fills with zeros','sarq is for unsigned; shrq is for signed','There is no difference','shrq sets the carry flag; sarq does not'], a:1,
 exp:`<p>sar = <strong>arithmetic</strong> (signed: keeps the sign). shr = <strong>logical</strong> (unsigned: fills with zeros). Left shifts are the same either way (<code>salq</code> = <code>shlq</code>).</p>`},
{q:`x86-64 has separate <code>add</code> instructions for signed and unsigned integers.`, tf:false,
 exp:`<p><strong>False.</strong> The slides say "no distinction between signed and unsigned int." Two's complement addition produces the same bits either way. The difference appears only in which <em>flags</em> you check (CF vs OF) and which jumps you use.</p>`},
{q:`What does <code>subq %rsi, %rdi</code> compute?`, opts:['%rsi = %rsi - %rdi','%rdi = %rdi - %rsi','%rdi = %rsi - %rdi','%rax = %rdi - %rsi','Only sets flags; nothing is stored'], a:1,
 exp:`<p>Dest = Dest &minus; Src. Watch the argument order. <code>cmpq</code> computes the same subtraction but stores nothing.</p>`},
{q:`After <code>xorq %rax, %rax</code>, what is in %rax (decimal)?`, fill:'0', exp:`<p>x ^ x = 0 for any x. Compilers use xor (or <code>xorl %eax,%eax</code>) as a short way to zero a register.</p>`},
{q:`<code>%rax = 5</code>. After <code>notq %rax</code>, what is in %rax (decimal)?`, fill:'-6', exp:`<p>~x = &minus;x &minus; 1, so ~5 = &minus;6. Don't confuse it with <code>negq</code>, which gives &minus;5.</p>`},
{q:`<code>%rax = 5</code>. After <code>negq %rax</code>, what is in %rax (decimal)?`, fill:'-5', exp:`<p>negq: Dest = &minus;Dest.</p>`},
{q:`<code>%rdi = 13</code>. After <code>andq $1, %rdi</code>, what is in %rdi (decimal)?`, fill:'1', exp:`<p>13 = 1101<sub>2</sub>, and &amp; 1 keeps the lowest bit, which is 1. This tests odd/even and is the <code>x &amp; 0x1</code> step in popcount.</p>`},

/* ====================================================== 5 */
{sec:'s5', title:'5. Condition codes, cmp/test, set, jumps & cmov', src:'Slides 19 &middot; HW12 Q10&ndash;11, Q20 &middot; HW16 Q8'},
{q:`Which condition code flag detects <strong>unsigned</strong> overflow?`, opts:['CF','ZF','SF','OF','PF','DF'], a:0,
 exp:`<p>CF (carry flag) is set on a carry out of the most significant bit, which is unsigned overflow. OF is signed overflow, ZF means the result is zero, and SF means the result is negative.</p>`},
{q:`Which flag detects <strong>signed</strong> (two's complement) overflow?`, opts:['CF','ZF','SF','OF','PF','DF'], a:3,
 exp:`<p>OF is set when two operands with the same sign produce a result with the opposite sign: (a&lt;0 == b&lt;0) &amp;&amp; (t&lt;0 != a&lt;0).</p>`},
{q:`<code>cmpq %rsi, %rdi</code> sets the flags based on:`, opts:['%rsi - %rdi, stored in %rsi','%rdi - %rsi, stored in %rdi','%rdi - %rsi, without storing the result','%rdi &amp; %rsi, without storing the result','%rsi + %rdi'], a:2,
 exp:`<p><code>cmpq b, a</code> sets flags as if computing a &minus; b, but discards the result. The operands are "reversed": <code>cmpq %rsi,%rdi</code> followed by <code>jg</code> means "jump if %rdi &gt; %rsi".</p>`},
{q:`<code>testq %rax, %rax</code> followed by <code>je .L1</code> jumps when:`, opts:['%rax is negative','%rax equals 0','%rax is positive','%rax is odd','Always','Never'], a:1,
 exp:`<p>testq computes %rax &amp; %rax = %rax (not stored). ZF=1 exactly when %rax == 0, and je jumps on ZF. This is the standard null or zero check.</p>`},
{q:`If %rdi = 5 and %rsi = 3, what is in %eax (decimal) after:`, code:C`cmpq   %rsi, %rdi
setg   %al
movzbl %al, %eax`, fill:'1',
 exp:`<p>Compares %rdi to %rsi: is 5 &gt; 3 (signed)? Yes, so setg writes 1 to %al, and movzbl zero-extends it, giving <strong>1</strong>. This is <code>return x &gt; y;</code>.</p>`},
{q:`If %rdi = 0 and %rsi = 1, what is in %eax (decimal) after the same three instructions (<code>cmpq %rsi,%rdi; setg %al; movzbl %al,%eax</code>)?`, fill:'0',
 exp:`<p>Is 0 &gt; 1? No, so the result is 0. This is the exact HW12 Q20.</p>`},
{q:`<strong>Trick:</strong> %rdi = &minus;1 and %rsi = 1. What is in %eax (decimal) after:`, code:C`cmpq   %rsi, %rdi
seta   %al
movzbl %al, %eax`, fill:'1',
 exp:`<p><code>seta</code> = "above" = <strong>unsigned</strong> greater. As unsigned, &minus;1 is 0xFFFF&hellip;FF, which is greater than 1, so the result is <strong>1</strong>. <code>setg</code> (signed) would give 0. Same bits, different answer.</p>`},
{q:`How many bytes of the destination does a <code>setX</code> instruction write?`, opts:['1 (the low-order byte); the rest is unchanged','2','4, zeroing the upper half','8, zero-extended','It depends on the suffix'], a:0,
 exp:`<p>setX writes 0 or 1 to a single byte register such as %al. The other 7 bytes are untouched, which is why <code>movzbl %al,%eax</code> usually follows to clear the rest.</p>`},
{q:`After <code>cmpq %rsi, %rdi</code>, <code>jl .L2</code> is taken when:`, opts:['%rdi &lt; %rsi (unsigned)','%rdi &lt; %rsi (signed)','%rsi &lt; %rdi (signed)','%rdi &le; %rsi (signed)','%rdi == %rsi'], a:1,
 exp:`<p>l/le/g/ge are <strong>signed</strong>; b/be/a/ae are <strong>unsigned</strong> (below/above). jl is taken when SF^OF = 1.</p>`},
{q:`Which jump means "jump if <strong>unsigned</strong> greater than or equal"?`, opts:['jge','jg','ja','jae','jb','jl'], a:3,
 exp:`<p>jae = above or equal (CF=0). jge is the signed version. Memory hook: <strong>a</strong>bove and <strong>b</strong>elow are unsigned; <strong>g</strong>reater and <strong>l</strong>ess are signed.</p>`},
{q:`Which flag combination does <code>jl</code> (signed less) test?`, opts:['CF','ZF','SF ^ OF','~(SF ^ OF) &amp; ~ZF','(SF ^ OF) | ZF','~CF &amp; ~ZF'], a:2,
 exp:`<p>jl: SF^OF. jle: (SF^OF)|ZF. jg: ~(SF^OF)&amp;~ZF. ja: ~CF&amp;~ZF. jb: CF.</p>`},

{block:'Comparison', n:3, html:`<code>unknown(long x, long y)</code>: x in %rdi, y in %rsi.`, code:C`unknown:
  cmpq %rsi, %rdi
  jle  .L4
  movq %rdi, %rax
  addq %rsi, %rax
  jmp  .L5
.L4:
  movq %rsi, %rax
  subq %rdi, %rax
.L5:
  ret`},
{q:`If %rdi = 2 and %rsi = 3, what is the return value (decimal)?`, fill:'1', exp:`<p>2 &le; 3, so the jump to .L4 is taken: y &minus; x = 3 &minus; 2 = 1. The function is <code>return (x &gt; y) ? x + y : y - x;</code></p>`},
{q:`If %rdi = 6 and %rsi = 2, what is the return value (decimal)?`, fill:'8', exp:`<p>6 &gt; 2, so it falls through: x + y = 8.</p>`},
{q:`If %rdi = 4 and %rsi = 4, what is the return value (decimal)?`, fill:'0', exp:`<p>4 &le; 4, so the jump is taken (<code>jle</code> includes equal): 4 &minus; 4 = 0.</p>`},
{q:`In compiled if/else code, the conditional jump usually tests:`, opts:['The C condition exactly as written','The <em>negation</em> of the C condition, jumping to the else part','Only equality','Only unsigned conditions','Nothing; if/else uses cmov only'], a:1,
 exp:`<p>The goto form is <code>if (!Test) goto Else;</code>. The jump fires when the C test is <em>false</em>. The HW16 hint says: "in assembly if jumps when it evaluates FALSE." For <code>if (x &gt; y)</code> you see <code>jle</code>.</p>`},

{block:'Assembly to C (HW16 style)', n:4, html:`<code>int mystery(int x)</code>, x in %edi.`, code:C`mystery:
  testl %edi, %edi       # Line 1
  je    .L3              # Line 2
  movl  %edi, %eax       # Line 3
  sall  $3, %eax         # Line 4
  ret                    # Line 5
.L3:
  movl  $7, %eax         # Line 6
  ret`},
{q:`What is the C equivalent of Lines 1 &amp; 2? (No spaces, semicolon, or braces, e.g. <code>if(...)</code>.)`, fill:'if(x!=0)',
 exp:`<p>je jumps to .L3 when x == 0, so the fall-through body runs when x != 0. The C is <code>if(x!=0)</code>; the assembly tests the opposite.</p>`},
{q:`With x in %eax at Line 3, what is the C equivalent of Line 4? (Format <code>x=...;</code>, no spaces.)`, fill:'x=x*8;', alt:'x*=8; / x=x<<3;',
 exp:`<p>Shift left by 3 = multiply by 8. HW16 used <code>sall $4</code>, which is x=x*16.</p>`},
{q:`What does <code>printf("%d\\n", mystery(3));</code> print?`, opts:['3','7','8','11','24','27','48','56'], a:4,
 exp:`<p>3 != 0, so 3 &lt;&lt; 3 = 24.</p>`},
{q:`What does <code>mystery(0)</code> return?`, fill:'7', exp:`<p>x == 0, so it jumps to .L3 and returns 7.</p>`},

{q:`A conditional move (<code>cmov</code>) can be faster than a branch because:`, opts:['It uses fewer registers','It avoids branch misprediction penalties in the pipeline','It skips computing one of the values','It does not need condition codes','It is required by the ABI'], a:1,
 exp:`<p>cmov computes <em>both</em> results and then picks one, so there's no jump to mispredict. That suits short, safe expressions.</p>`},
{q:`When will the compiler NOT use a conditional move for <code>val = Test ? Then : Else</code>?`, opts:['When Then or Else could have side effects, could fault (e.g. dereferencing a null pointer), or is expensive to compute','When the values are of type long','When Test uses a signed comparison','When the function has more than 6 arguments','Never; gcc always uses cmov'], a:0,
 exp:`<p>Because cmov evaluates both branches, it's unsafe for <code>p ? *p : 0</code> (it could dereference null), for expressions with side effects (<code>x &gt; 0 ? x *= 7 : x += 3</code>), and wasteful for expensive computations.</p>`},

/* ====================================================== 6 */
{sec:'s6', title:'6. Loops: do-while, while, for', src:'Slides 20 &middot; HW13 Q2&ndash;13'},
{block:'Do Loop (Question Block 1)', n:4, html:`GCC generates the following assembly for <code>f1</code>. <code>n</code> is passed in %rdi.`, code:C`long f1(long n) {
  long result = 1;
  do {
    result *= n;
    n = n - 2;
  } while (n > 0);
  return result;
}

1 f1:
2   movl $1, %eax
3 .L2:
4   ?     %rdi, %rax
5   ?     $2, %rdi
6   cmpq  $0, %rdi
7   ?     .L2
8   rep; ret`},
{q:`What is missing in Line 4?`, fill:'imulq', exp:`<p><code>result *= n</code> becomes %rax = %rax &times; %rdi, which is <code>imulq %rdi, %rax</code>.</p>`},
{q:`What is missing in Line 5?`, fill:'subq', exp:`<p><code>n = n - 2</code> becomes <code>subq $2, %rdi</code>.</p>`},
{q:`What is missing in Line 7?`, fill:'jg', exp:`<p><code>cmpq $0,%rdi</code> compares n to 0. Loop while n &gt; 0 (signed), so <code>jg</code>. A do-while loop jumps back when the condition is <em>true</em>. HW13 used <code>cmpq $1,%rdi</code> with <code>jge</code> for <code>n &gt;= 1</code>.</p>`},
{q:`What does <code>f1(5)</code> return?`, fill:'15', exp:`<p>result = 5 (n becomes 3), then 15 (n becomes 1), then 15 (n becomes &minus;1), and the loop stops. 5&times;3&times;1 = 15.</p>`},

{block:'While Loop (Question Block 2)', n:6, html:`<code>n</code> is in %rdi.`, code:C`long f2(long n) {
  long result = 0;
  while (n > 0) {
    result += n;
    n -= 3;
  }
  return result;
}

1 f2:
2   movl $0, %eax
3   ?     .L3
4 .L2:
5   ?     %rdi, %rax
6   ?     $3, %rdi
7 .L3:
8   cmpq  ?, %rdi
9   ?     .L2
10  rep; ret`},
{q:`What is missing in Line 3?`, fill:'jmp', exp:`<p>This is the <strong>jump-to-middle</strong> translation used at -Og: unconditionally jump to the test first, because a while loop may run zero times.</p>`},
{q:`What is missing in Line 5?`, fill:'addq', exp:`<p><code>result += n</code> becomes <code>addq %rdi, %rax</code>.</p>`},
{q:`What is missing in Line 6?`, fill:'subq', exp:`<p><code>n -= 3</code> becomes <code>subq $3, %rdi</code>.</p>`},
{q:`What is missing in Line 8?`, fill:'$0', exp:`<p>The test is n &gt; 0, so compare with the immediate <code>$0</code>. The <code>$</code> is required; without it, <code>0</code> would mean memory address 0.</p>`},
{q:`What is missing in Line 9?`, fill:'jg', exp:`<p>The loop goes back while n &gt; 0, so <code>jg</code> (signed greater).</p>`},
{q:`What does <code>f2(7)</code> return?`, fill:'12', exp:`<p>7 (n becomes 4), then 11 (n becomes 1), then 12 (n becomes &minus;2), and the loop stops.</p>`},

{block:'For Loop (Question Block 3)', n:5, html:`<code>n</code> is in %rdi, <code>i</code> is kept in %rdx.`, code:C`long f3(long n) {
  long i;
  long result = 0;
  for (i = 1; i < n; i *= 2)
    result += i;
  return result;
}

1 f3:
2   movl $0, %eax
3   movl $1, %edx
4   jmp  ?
5 .L2:
6   addq ?
7   addq ?
8 .L3:
9   cmpq ?
10  jl   .L2
11  rep; ret`},
{q:`What is the missing operand in Line 4?`, fill:'.L3', exp:`<p>Jump to the test label first (jump-to-middle).</p>`},
{q:`What are the missing operands in Line 6 (separate with a comma)?`, fill:'%rdx, %rax', alt:'%rdx,%rax',
 exp:`<p><code>result += i</code> becomes <code>addq %rdx, %rax</code>, with <strong>source first, then destination</strong>. <em>This is the exact mistake from HW13</em>: you wrote "%rax, %rdx", which would add result into i.</p>`},
{q:`What are the missing operands in Line 7?`, fill:'%rdx, %rdx', alt:'%rdx,%rdx',
 exp:`<p><code>i *= 2</code> is the same as i = i + i, so <code>addq %rdx, %rdx</code>. (Line 7's instruction is given as addq. A compiler could also use <code>salq $1,%rdx</code>.)</p>`},
{q:`What are the missing operands in Line 9?`, fill:'%rdi, %rdx', alt:'%rdi,%rdx',
 exp:`<p>The test is i &lt; n with <code>jl</code>. <code>cmpq b, a</code> computes a &minus; b, so we need a = i (%rdx) and b = n (%rdi): <code>cmpq %rdi, %rdx</code>. Writing <code>cmpq %rdx,%rdi</code> would test n &lt; i instead.</p>`},
{q:`What does <code>f3(10)</code> return?`, fill:'15', exp:`<p>i = 1, 2, 4, 8 are all &lt; 10, and 1+2+4+8 = 15. Next i = 16 fails the test.</p>`},

{q:`Which C loop corresponds to this code? (%rdi = n, result in %rax)`, code:C`  movl $0, %eax
.L2:
  addq %rdi, %rax
  decq %rdi
  jne  .L2
  ret`, opts:['while (n != 0) { result += n; n--; }','do { result += n; n--; } while (n != 0);','for (i = 0; i < n; i++) result += i;','do { result += n; n--; } while (n > 0);','while (n > 0) result += n--;'], a:1,
 exp:`<p>There's no initial jump or test, so the body runs first: a <strong>do-while</strong>. <code>jne</code> uses the flags set by <code>decq</code>, so it loops while n != 0. Trick: called with n = 0, it adds 0, decrements to &minus;1, and keeps looping for a very long time.</p>`},
{q:`For the code above, what is the return value when %rdi = 4?`, fill:'10', exp:`<p>4+3+2+1 = 10. When n reaches 0, decq sets ZF and jne falls through.</p>`},
{q:`Which loop form always executes its body at least once?`, opts:['while','for','do-while','All of them','None of them'], a:2,
 exp:`<p>do-while tests at the bottom. while and for loops may run zero times, which is why their translations jump to the test first (jump-to-middle) or add an initial guard (guarded-do).</p>`},
{q:`Which while-loop translation does gcc use at <strong>lower</strong> optimization levels such as -Og?`, opts:['Guarded-do','Jump-to-middle','Jump table','Conditional move','Loop unrolling'], a:1,
 exp:`<p>Jump-to-middle (<code>goto test;</code> at the top) is used at -Og. Guarded-do (<code>if (!Test) goto done;</code> and then a do-while) is used at higher levels such as -O1.</p>`},
{q:`In the guarded-do for loop translation, the initial test can be removed when:`, opts:['The loop has a break statement','The compiler knows the initial value already satisfies the test (e.g. i = 0 &lt; WSIZE)','The loop variable is unsigned','The loop body is empty','Never'], a:1,
 exp:`<p>In the pcount_for example, i = 0 and WSIZE = 64 are constants, so 0 &lt; 64 is always true and the guard is dropped. If the test compares against an unknown parameter, the guard must stay.</p>`},
{q:`What is the purpose of <code>rep; ret</code>?`, opts:['Repeat the return until %rax is 0','rep acts as a no-op so ret is not the direct target of a conditional jump (for some branch predictors)','It returns twice','It restores the stack pointer','It clears the flags'], a:1,
 exp:`<p>Per the slides, rep is a no-op here. It keeps ret from being the destination of a conditional jump's fall-through, which helps the AMD branch predictor. It does not change the result.</p>`},
{q:`A <code>for (Init; Test; Update) Body</code> loop is equivalent to:`, opts:['Init; do { Body; Update; } while (Test);','Init; while (Test) { Body; Update; }','while (Test) { Init; Body; Update; }','Init; while (Test) { Update; Body; }','do { Init; Body; } while (Test);'], a:1,
 exp:`<p>A for loop becomes a while loop, and then the while translation applies (jump-to-middle or guarded-do).</p>`},
{q:`<code>pcount_do(x)</code> counts the 1 bits using <code>result += x &amp; 1; x &gt;&gt;= 1;</code> in a do-while. What does it return for x = 11?`, fill:'3', exp:`<p>11 = 1011<sub>2</sub>, which has three 1 bits. It uses <code>shrq</code> (logical) because x is unsigned.</p>`},

/* ====================================================== 7 */
{sec:'s7', title:'7. Switch statements & jump tables', src:'Slides 20 (switch_eg)'},
{block:'switch_eg', n:8, html:`x in %rdi, y in %rsi, z in %rdx.`, code:C`long switch_eg(long x, long y, long z) {
  long w = 1;
  switch (x) {
    case 1:  w = y * z;  break;
    case 2:  w = y / z;        /* Fall through */
    case 3:  w += z;     break;
    case 5:
    case 6:  w -= z;     break;
    default: w = 2;
  }
  return w;
}

switch_eg:
  movq  %rdx, %rcx
  cmpq  $6, %rdi        # x:6
  ja    .L8             # default
  jmp   *.L4(,%rdi,8)`},
{q:`What does <code>switch_eg(2, 6, 3)</code> return?`, fill:'5', exp:`<p>Case 2: w = 6/3 = 2. There's no break, so it <strong>falls through</strong> to case 3: w += 3, giving <strong>5</strong>.</p>`},
{q:`What does <code>switch_eg(1, 4, 3)</code> return?`, fill:'12', exp:`<p>Case 1: w = 4&times;3 = 12, then break.</p>`},
{q:`What does <code>switch_eg(6, 4, 3)</code> return?`, fill:'-2', exp:`<p>Cases 5 and 6 share code: w = 1 &minus; 3 = &minus;2.</p>`},
{q:`What does <code>switch_eg(4, 4, 3)</code> return?`, fill:'2', exp:`<p>There's no case 4, so its jump-table entry points to the default code: w = 2.</p>`},
{q:`What does <code>switch_eg(-1, 4, 3)</code> return?`, fill:'2', exp:`<p><code>ja</code> is an <strong>unsigned</strong> compare. &minus;1 as unsigned is huge (&gt; 6), so it jumps to the default: 2. One unsigned compare catches both x &lt; 0 and x &gt; 6.</p>`},
{q:`Why does <code>jmp *.L4(,%rdi,8)</code> use a scale of 8?`, opts:['Each case block is 8 bytes long','Each jump table entry is an 8-byte code address','x is multiplied by 8 in the C code','The table holds 8 entries','The stack is 8-byte aligned'], a:1,
 exp:`<p>The jump table is an array of 8-byte addresses (<code>.quad</code> labels). The target is M[.L4 + 8x], and the <code>*</code> means an indirect jump to the address loaded from that entry.</p>`},
{q:`How many entries does the jump table for switch_eg have?`, fill:'7', exp:`<p>Indices 0 through 6 (the cmpq $6 range check). Entries 0 and 4 point to the default, and entries 5 and 6 point to the same block.</p>`},
{q:`Why does the code use <code>ja</code> (unsigned) rather than <code>jg</code> for the range check?`, opts:['ja is faster','A single unsigned compare sends both negative x and x &gt; 6 to the default','x is declared unsigned','jg would not compile','To set the carry flag for the jump table'], a:1,
 exp:`<p>Negative numbers become very large as unsigned, so <code>x &gt;u 6</code> covers both out-of-range directions with one branch.</p>`},
{q:`Given this jump table, which cases share code? (index = x)`, code:C`.L4:
  .quad .L8   # x = 0
  .quad .L3   # x = 1
  .quad .L5   # x = 2
  .quad .L9   # x = 3
  .quad .L8   # x = 4
  .quad .L7   # x = 5
  .quad .L7   # x = 6`, opts:['0 and 4 (both are the default .L8); 5 and 6 (.L7)','Only 5 and 6','1 and 2','3 and 4','None'], a:0,
 exp:`<p>Repeated labels mean shared targets. .L8 appears for the missing cases (0, 4), so it's the default. .L7 handles <code>case 5: case 6:</code>.</p>`},
{q:`When does a compiler prefer a jump table over a chain of if/else comparisons?`, opts:['When there are many cases with a small, dense range of values','When there are only 2 cases','When the case values are widely spread (e.g. 1, 1000, 1000000)','When the cases have side effects','Always'], a:0,
 exp:`<p>A jump table gives O(1) dispatch regardless of the number of cases, but it needs a reasonably dense range so the table isn't huge.</p>`},
{q:`In a switch on <code>x</code> whose cases run from 100 to 106, what is <code>leaq -100(%rdi), %rax</code> for?`, opts:['It adjusts x so the jump table index starts at 0','It allocates 100 bytes of stack','It checks if x is negative','It computes the default value','It loads case 100'], a:0,
 exp:`<p>The compiler shifts the range to 0&hellip;6, then does <code>cmpq $6,%rax; ja default; jmp *.L(,%rax,8)</code>.</p>`},
{q:`The result of a switch statement is independent of the order in which the cases are listed.`, tf:true,
 exp:`<p><strong>True</strong>, per the slides. Execution depends only on which label x matches and on fall-through, not on where the case appears in the list.</p>`},

/* ====================================================== 8 */
{sec:'s8', title:'8. Structs, unions, alignment & byte order', src:'Slides 21 &middot; HW14 Q2&ndash;15'},
{q:`Using x86-64 type sizes and alignment, what does <code>sizeof(r)</code> print?`, code:C`struct rect {
  char   c;
  double d;
  int    i;
} r;`, fill:'24', exp:`<p>c at 0, 7 bytes of padding, d at 8, i at 16 (bytes 16&ndash;19). The largest alignment K = 8, so the total rounds up from 20 to <strong>24</strong>.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`struct rect {
  int  a[3];
  char c;
  long l;
} r;`, fill:'24', exp:`<p>a at 0&ndash;11, c at 12, padding to 16, l at 16&ndash;23. 24 is already a multiple of 8.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`struct rect {
  short s;
  char  c;
  int   i;
  char *p;
} r;`, fill:'16', exp:`<p>s at 0&ndash;1, c at 2, 1 byte of padding, i at 4&ndash;7, p (pointer = 8 bytes) at 8&ndash;15. Total 16.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`struct rect {
  char  a;
  char  b;
  short s;
  long  l;
  char  c;
} r;`, fill:'24', exp:`<p>a=0, b=1, s=2&ndash;3, padding to 8, l=8&ndash;15, c=16, then pad to 24 (multiple of 8). Trailing padding counts.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`struct rect {
  char c[5];
  int  i;
} r;`, fill:'12', exp:`<p>c occupies 0&ndash;4. i needs a multiple of 4, so it goes at 8. End = 12, and K = 4 (no 8-byte members), so the total is 12.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`union rect {
  char   c[10];
  int    i;
  double d;
} r;`, fill:'16', exp:`<p>A union is as large as its largest member (10 bytes), rounded up to the largest alignment (8), giving <strong>16</strong>. Don't just answer 10.</p>`},
{q:`What does <code>sizeof(r)</code> print?`, code:C`union rect {
  char  c[4];
  short s;
  int   i;
} r;`, fill:'4', exp:`<p>All members overlap at offset 0. The largest is 4 bytes, and 4 is already a multiple of the alignment 4.</p>`},
{q:`Which statement about struct field ordering is TRUE?`, opts:['The compiler reorders fields to minimize padding','Fields are always laid out in declaration order','Fields are sorted by size','Unions place each member at a different offset','Padding is never added at the end'], a:1,
 exp:`<p>Field order always matches the declaration, even when another order would be smaller. To save space, <em>you</em> put the large types first.</p>`},
{q:`Which declaration is smaller?`, code:C`struct S4 { char c; int i; char d; };
struct S5 { int i; char c; char d; };`, opts:['S4 (8 bytes)','S5 (8 bytes); S4 is 12 bytes','They are both 12 bytes','They are both 6 bytes','S4 (6 bytes)'], a:1,
 exp:`<p>S4: c at 0, pad 3, i at 4, d at 8, pad to 12. S5: i at 0, c at 4, d at 5, pad to 8. Putting large types first eliminates the internal padding.</p>`},
{q:`On x86-64, misaligned data causes the program to crash.`, tf:false,
 exp:`<p><strong>False.</strong> Per the slides, alignment is "required on some machines; <em>advised</em> on x86-64." Misaligned accesses still work but may be slower (they can span quad-word or page boundaries).</p>`},

{block:'Memory Offset', n:4, html:`Using x86-64 sizes and alignment:`, code:C`struct rec {
  char  c;
  short s;
  long *p;
  int   i;
} r;`},
{q:`What does <code>sizeof(r)</code> print?`, fill:'24', exp:`<p>c=0, s=2, p=8, i=16 (16&ndash;19), padded to 24.</p>`},
{q:`What is the offset from the base address of r to access <code>s</code>?`, fill:'2', exp:`<p>A short must sit at an even address, so there's 1 byte of padding after c.</p>`},
{q:`What is the offset to access <code>p</code>?`, fill:'8', exp:`<p>A pointer is 8 bytes and needs a multiple of 8. s ends at 3, so p starts at 8.</p>`},
{q:`What is the offset to access <code>i</code>?`, fill:'16', exp:`<p>Right after p (8&ndash;15).</p>`},

{block:'Assembly (Move Block)', n:5, html:`The address of <code>r</code> is in %rdi.`, code:C`struct S {
  int    i;
  char   c;
  long   l;
  short *ps;
} r;`},
{q:`What does <code>sizeof(r)</code> print?`, fill:'24', exp:`<p>i=0, c=4, l=8, ps=16. Total 24.</p>`},
{q:`Missing operand for moving <code>i</code> to %eax: <code>movl ____, %eax</code>`, fill:'(%rdi)', alt:'0(%rdi)', exp:`<p>Offset 0, so <code>(%rdi)</code>. <code>movl</code> because an int is 4 bytes.</p>`},
{q:`Missing operand for moving <code>c</code> to %al: <code>movb ____, %al</code>`, fill:'4(%rdi)', exp:`<p>c is at offset 4. <code>movb</code> because a char is 1 byte.</p>`},
{q:`Missing operand for moving <code>l</code> to %rax: <code>movq ____, %rax</code>`, fill:'8(%rdi)', exp:`<p>Offset 8.</p>`},
{q:`Missing operand for moving <code>ps</code> to %rax: <code>movq ____, %rax</code>`, fill:'16(%rdi)', exp:`<p>Offset 16. ps is a <em>pointer</em>, so it's 8 bytes (movq) even though it points to a short.</p>`},

{q:`<code>struct S3 { short i; float v; short j; } b[10];</code> with b at address 0x1000. What is the address of <code>b[3].j</code> (hex, no prefix)?`, fill:'102C',
 exp:`<p>sizeof(S3) = 12 (i 0&ndash;1, v 4&ndash;7, j 8&ndash;9, padded to 12). &amp;b[3].j = 0x1000 + 12&times;3 + 8 = 0x1000 + 36 + 8 = 0x1000 + 0x2C = <strong>0x102C</strong>.</p>`},
{q:`For <code>struct rec { int a[4]; size_t i; struct rec *next; }</code>, with r in %rdi and idx in %rsi, which instruction computes <code>&amp;(r-&gt;a[idx])</code>?`, opts:['leaq (%rdi,%rsi,4), %rax','movl (%rdi,%rsi,4), %eax','leaq 16(%rdi,%rsi,8), %rax','leaq (%rdi,%rsi,8), %rax','movq 24(%rdi), %rax'], a:0,
 exp:`<p>a is at offset 0, and each int is 4 bytes, so r + 4&middot;idx. Other offsets in that struct: i at 16, next at 24.</p>`},
{q:`In the linked-list loop for that struct, what does <code>movq 24(%rdi), %rdi</code> do?`, opts:['Loads r-&gt;i','Advances r = r-&gt;next','Stores val into a[ind]','Tests r for NULL','Computes &amp;r-&gt;a[6]'], a:1,
 exp:`<p>next is at offset 24, so this loads the next pointer into %rdi (r = r-&gt;next). Then <code>testq %rdi,%rdi; jne</code> loops until NULL.</p>`},

{q:`x86-64 is little endian. If the 4-byte int 0x12345678 is stored at address 0x100, which byte is at address 0x100?`, opts:['0x12','0x34','0x56','0x78','0x00'], a:3,
 exp:`<p>Little endian means the <strong>least</strong> significant byte goes at the lowest address: 0x100 holds 78, 0x101 holds 56, 0x102 holds 34, 0x103 holds 12. Sparc is big endian, and ARM is bi-endian.</p>`},
{q:`<code>union { unsigned char c[8]; unsigned short s[4]; unsigned int i[2]; unsigned long l[1]; } dw;</code> with <code>dw.c[j] = 0xf0 + j</code> for j = 0..7. On x86-64, what is <code>dw.s[1]</code> (hex, no prefix)?`, fill:'F3F2',
 exp:`<p>s[1] overlays c[2] and c[3]. Little endian puts c[2] (0xf2) in the low byte, so the value is 0xf3f2.</p>`},
{q:`Same union. What is <code>dw.i[1]</code> (hex, no prefix)?`, fill:'F7F6F5F4', exp:`<p>i[1] overlays c[4..7]. Low byte = c[4] = f4, so 0xf7f6f5f4.</p>`},
{q:`Given <code>union { float f; unsigned u; } arg; arg.u = u; return arg.f;</code>, this is the same as:`, opts:['(float) u','*(float *) &amp;u','(unsigned) f','u / 1.0','It does not compile'], a:1,
 exp:`<p>A union reinterprets the <em>same bits</em> as another type. <code>(float)u</code> would convert the numeric value, which changes the bits. Unions provide a way around C's type system.</p>`},

/* ====================================================== 9 */
{sec:'s9', title:'9. The stack: push, pop, call & ret', src:'Slides 22 (Control & Data Flow) &middot; HW15 Q2&ndash;20 &middot; HW16 Q2&ndash;3'},
{block:'Push and Pop', n:9, html:`A sequence of push and pop instructions (not a real program). Assume <code>%rsp = 0x2020</code> when Line 1 executes. All data is 8 bytes. Answer in hex without a prefix.`, code:C`1 movq  $7, %rax
2 movq  $9, %rbx
3 pushq %rbx
4 pushq %rax
5 popq  %rcx
6 pushq %rcx
7 pushq %rbx
8 popq  %rdx
9 popq  %rsi`},
{q:`What is in %rsp after Line 3 executes?`, fill:'2018', exp:`<p>pushq decrements %rsp by 8 <em>first</em>, then stores: 0x2020 &minus; 8 = 0x2018, and M[0x2018] = 9. The stack grows toward lower addresses.</p>`},
{q:`What is in %rsp after Line 4?`, fill:'2010', exp:`<p>0x2018 &minus; 8 = 0x2010, and M[0x2010] = 7.</p>`},
{q:`What is in %rsp after Line 5?`, fill:'2018', exp:`<p>popq reads M[%rsp] (7) into %rcx, then %rsp += 8, giving 0x2018.</p>`},
{q:`What is in %rsp after Line 7?`, fill:'2008', exp:`<p>Line 6 pushes 7 (rsp becomes 0x2010) and Line 7 pushes 9 (rsp becomes 0x2008).</p>`},
{q:`What is in %rcx after all lines execute?`, fill:'7', exp:`<p>Line 5 popped the 7 that Line 4 pushed. Last in, first out.</p>`},
{q:`What is in %rdx after all lines?`, fill:'9', exp:`<p>Line 8 pops the most recent push (Line 7: %rbx = 9).</p>`},
{q:`What is in %rsi after all lines?`, fill:'7', exp:`<p>Line 9 pops what Line 6 pushed (%rcx = 7).</p>`},
{q:`What is in %rsp after all lines?`, fill:'2018', exp:`<p>Net: 4 pushes and 3 pops = &minus;8, so 0x2020 &minus; 8 = 0x2018.</p>`},
{q:`What is on top of the stack after all lines?`, fill:'9', exp:`<p>%rsp = 0x2018, and M[0x2018] still holds the 9 that Line 3 pushed. Popping doesn't erase memory; it only moves %rsp.</p>`},

{block:'Control (decimal addresses)', n:5, html:`The code is loaded at these addresses (decimal). Answer in decimal.`, code:C`1  2000: addq  $3, %rdi
2  2004: movq  %rdi, %rax
3  2007: retq
   ...........
4  2040: movq  $5, %rdi
5  2047: callq 2000
6  2052: movq  %rax, %rdx`},
{q:`What is in %rip after the instruction on Line 4 executes?`, fill:'2047', exp:`<p>%rip always holds the address of the <em>next</em> instruction. After line 4 (2040&ndash;2046), that's 2047.</p>`},
{q:`What is in %rip after the instruction on Line 5 (the call) executes?`, fill:'2000', exp:`<p>call jumps to the target, so %rip = 2000.</p>`},
{q:`What return address is pushed onto the stack by Line 5?`, fill:'2052', exp:`<p>The address of the instruction <em>after</em> the call: 2052. The call itself is at 2047 and is 5 bytes long.</p>`},
{q:`What is in %rip after the instruction on Line 3 (retq) executes?`, fill:'2052', exp:`<p>ret pops the return address into %rip, so execution continues at 2052.</p>`},
{q:`What is in %rdx after Line 6 executes?`, fill:'8', exp:`<p>%rdi = 5, then + 3 = 8. That's returned in %rax and copied to %rdx.</p>`},

{block:'Flow Control (HW15 style, 8 choices)', n:10, html:`Assume <code>%rsp = 0x2210</code> and <code>%rbx = 0x2234</code> when the program starts at Line 1. This code is only for learning control flow and data transfer. All questions use these choices:<br><code>A 0x21F8 &nbsp;B 0x2200 &nbsp;C 0x2202 &nbsp;D 0x2208 &nbsp;E 0x2210 &nbsp;F 0x2226 &nbsp;G 0x2234 &nbsp;H Unknown</code>`, code:C`1 0x2220: movq  $0x2200, %rdi
2 0x2223: callq 0x2230
3 0x2226: movq  0x8(%rsp), %rdx

4 0x2230: pushq %rbx
5 0x2231: pushq %rdi
6 0x2232: addq  $2, %rdi
7 0x2235: popq  %rdi
8 0x2236: popq  %rbx
9 0x2237: retq`},
{q:`What is on the top of the stack after Line 2 executes?`, opts:STACK8, a:5, exp:`<p>call pushes the return address, which is the next instruction, 0x2226 (F).</p>`},
{q:`What is in %rsp after Line 2?`, opts:STACK8, a:3, exp:`<p>0x2210 &minus; 8 = 0x2208 (D).</p>`},
{q:`What is on the top of the stack after Line 4?`, opts:STACK8, a:6, exp:`<p>pushq %rbx stores 0x2234 at 0x2200 (G).</p>`},
{q:`What is on the top of the stack after Line 5?`, opts:STACK8, a:1, exp:`<p>pushq %rdi stores 0x2200 (the value in %rdi) at 0x21F8 (B). Don't confuse the <em>value</em> pushed with the <em>address</em> it lands at.</p>`},
{q:`What is in %rsp after Line 5?`, opts:STACK8, a:0, exp:`<p>0x2208 &minus; 8 &minus; 8 = 0x21F8 (A).</p>`},
{q:`What is in %rdi after Line 7?`, opts:STACK8, a:1, exp:`<p>Line 6 made %rdi 0x2202, but Line 7 pops the saved 0x2200 back into it (B). The add is undone.</p>`},
{q:`What is in %rsp after Line 8?`, opts:STACK8, a:3, exp:`<p>Two pops: 0x21F8 + 16 = 0x2208 (D). The return address is on top again.</p>`},
{q:`What is in %rip after Line 9?`, opts:STACK8, a:5, exp:`<p>ret pops 0x2226 into %rip (F).</p>`},
{q:`What is in %rsp after Line 3?`, opts:STACK8, a:4, exp:`<p>ret already restored %rsp to 0x2210, and Line 3 only reads memory, so %rsp is still 0x2210 (E).</p>`},
{q:`What is in %rdx after Line 3?`, opts:STACK8, a:7, exp:`<p>It loads M[0x2210 + 8] = M[0x2218], which was never shown, so the answer is <strong>Unknown</strong> (H). Don't guess a value from the code.</p>`},

{q:`The x86 stack grows upward (toward higher memory addresses).`, tf:false,
 exp:`<p><strong>False.</strong> It grows toward <em>lower</em> addresses. push subtracts 8 from %rsp. (HW16 Q2.)</p>`},
{q:`Register %rbp points to the top element of the stack.`, tf:false,
 exp:`<p><strong>False.</strong> <code>%rsp</code> points to the top. <code>%rbp</code> is an optional frame pointer and is otherwise a callee-saved general register. (HW16 Q3.)</p>`},
{q:`<code>pushq %rbx</code> is equivalent to:`, opts:['subq $8,%rsp; movq %rbx,(%rsp)','movq %rbx,(%rsp); subq $8,%rsp','addq $8,%rsp; movq %rbx,(%rsp)','movq (%rsp),%rbx; addq $8,%rsp','movq %rbx,%rsp'], a:0,
 exp:`<p>Decrement first, then store at the new top.</p>`},
{q:`<code>popq %rax</code> is equivalent to:`, opts:['subq $8,%rsp; movq (%rsp),%rax','movq (%rsp),%rax; addq $8,%rsp','addq $8,%rsp; movq (%rsp),%rax','movq %rax,(%rsp); addq $8,%rsp','movq %rsp,%rax'], a:1,
 exp:`<p>Read the top, then increment %rsp. The memory still holds the old value.</p>`},
{q:`What does <code>call label</code> do?`, opts:['Jumps to label only','Pushes the return address (next instruction) and jumps to label','Pushes %rbp and jumps','Pops the return address into %rip','Saves all caller-saved registers'], a:1,
 exp:`<p>call = push the address of the next instruction, then set %rip to the label. ret = pop into %rip.</p>`},

/* ====================================================== 10 */
{sec:'s10', title:'10. Procedures: frames, arguments & register conventions', src:'Slides 23 (Memory Management) &middot; HW16 Q4&ndash;11 &middot; HW17'},
{q:`Which of the following is NOT included in an x86-64 stack frame?`, opts:['Saved registers','Return address','Local variables','Condition code flags','Arguments 7 and beyond (argument build area)'], a:3,
 exp:`<p>A frame can hold: the argument build area (7+ arguments), local variables that can't stay in registers, saved registers, an optional old %rbp, and the return address pushed by call. The flags live in the CPU, not on the stack. HW16 used "Frame size" as the wrong item. The size is not stored anywhere either.</p>`},
{q:`Which of the following x86 registers are <strong>caller-saved</strong>? All choices must be correct for credit.`, opts:REGSET8, a:[0,2,3,4,6],
 exp:`<p>Caller-saved: %rax (return), %rdi %rsi %rdx %rcx %r8 %r9 (arguments), and %r10 %r11 (temporaries). The callee may overwrite them freely, so the <em>caller</em> must save any value it needs after a call. Pick A, C, D, E, G.</p>`},
{q:`Which of the following x86 registers are <strong>callee-saved</strong>? Select all that apply (the course slides list %rsp in this group as a special case).`, opts:REGSET8, a:[1,5,7],
 exp:`<p>Callee-saved: %rbx, %rbp, %r12&ndash;%r15, and %rsp (special: it must be restored before ret). If a callee wants to use one, it must push it first and pop it before returning. Pick B, F, H.</p>`},
{q:`In what order are the first six integer/pointer arguments passed?`, opts:['%rax, %rbx, %rcx, %rdx, %rsi, %rdi','%rdi, %rsi, %rdx, %rcx, %r8, %r9','%rsi, %rdi, %rdx, %rcx, %r8, %r9','%rdi, %rsi, %rcx, %rdx, %r8, %r9','On the stack only','%r8, %r9, %r10, %r11, %r12, %r13'], a:1,
 exp:`<p>Mnemonic: "<strong>D</strong>iane's <strong>S</strong>ilk <strong>D</strong>ress <strong>C</strong>osts $<strong>8</strong> <strong>9</strong>" = rdi, rsi, rdx, rcx, r8, r9. Note that rdx comes <em>before</em> rcx.</p>`},
{q:`Which register holds the 4th integer argument?`, fill:'%rcx', exp:`<p>rdi (1), rsi (2), rdx (3), <strong>rcx (4)</strong>, r8 (5), r9 (6).</p>`},
{q:`Which register holds an integer return value?`, fill:'%rax', exp:`<p>%rax (or %eax for an int).</p>`},

{block:'Arguments on the stack (HW17 style)', n:6, html:`When <code>func()</code> is called from <code>call_func()</code>, %rsp = 0x2000, which is where the return address is stored.`, code:C`int func(a, b, c, d, e, f, g, h, i) { /* ... */ }

int call_func() {
  long i = 11; long j = 22; long k = 33;
  long l = 44; long m = 55; long n = 66;
  long o = 77; long p = 88; long q = 99;
  func(i, j, k, l, m, n, o, p, q);
  return 0;
}`},
{q:`What will be in %rdi when func() is called?`, fill:'11', exp:`<p>Argument 1 goes in %rdi.</p>`},
{q:`What will be in %r9 when func() is called?`, fill:'66', exp:`<p>Argument 6 goes in %r9.</p>`},
{q:`What will be in %rdx when func() is called?`, fill:'33', exp:`<p>Argument 3 goes in %rdx.</p>`},
{q:`What will be stored in memory at 0x2008?`, fill:'77', exp:`<p>Arguments 7+ go on the stack in the caller's argument build area, just <em>above</em> the return address. At entry: return address at 0x2000, arg 7 at 0x2008, arg 8 at 0x2010, arg 9 at 0x2018. Each argument takes an 8-byte slot.</p>`},
{q:`What will be stored in memory at 0x2018?`, fill:'99', exp:`<p>Argument 9 is 3 slots above the return address: 0x2000 + 3&times;8 = 0x2018.</p>`},
{q:`Inside func, right at entry, which operand reads the 8th argument?`, opts:['8(%rsp)','16(%rsp)','24(%rsp)','-16(%rsp)','%r10','(%rsp)'], a:1,
 exp:`<p>(%rsp) is the return address, 8(%rsp) is arg 7, and <strong>16(%rsp)</strong> is arg 8. If func pushes something first, every offset shifts by 8.</p>`},

{block:'Assembly to C (HW16 Block 1 style)', n:2, html:`<code>int mystery(int x, int y)</code>`, code:C`mystery:
  addl %esi, %edi            # Line 1
  leal (%rdi,%rdi,4), %eax   # Line 2
  addl %eax, %eax            # Line 3
  ret`},
{q:`What is the C equivalent of Line 1? (A complete statement with a semicolon, no spaces.)`, fill:'x+=y;', alt:'x=x+y;',
 exp:`<p>%edi (x) = %edi + %esi (y). The destination is x, so <code>x+=y;</code>. In HW16 it was <code>addl %edi,%esi</code>, meaning y+=x. Read the destination carefully.</p>`},
{q:`What does <code>printf("%d\\n", mystery(2, 3));</code> print?`, opts:['5','10','15','25','30','50','100','250'], a:5,
 exp:`<p>x = 5. Line 2: 5 + 5&times;4 = 25. Line 3: 25 + 25 = 50. So the function returns (x+y)*10.</p>`},

{block:'Calling incr', n:4, html:`incr adds val to *p and returns the <em>old</em> value of *p.`, code:C`long incr(long *p, long val) {
  long x = *p;  long y = x + val;
  *p = y;  return x;
}
long call_incr() {
  long v1 = 100;
  long v2 = incr(&v1, 25);
  return v1 + v2;
}

call_incr:
  subq  $16, %rsp
  movq  $100, 8(%rsp)
  movl  $25, %esi
  leaq  8(%rsp), %rdi
  call  incr
  addq  8(%rsp), %rax
  addq  $16, %rsp
  ret`},
{q:`What does call_incr() return (decimal)?`, fill:'225', exp:`<p>incr returns the old v1 (100) in %rax and sets v1 = 125. Then <code>addq 8(%rsp),%rax</code> gives 100 + 125 = <strong>225</strong>.</p>`},
{q:`Why is v1 stored on the stack (at 8(%rsp)) instead of in a register?`, opts:['Because its address is taken (&amp;v1), so it must live in memory','Because longs cannot be stored in registers','Because there are more than 6 arguments','To align the stack','Because incr is recursive'], a:0,
 exp:`<p>A register has no address. When code uses <code>&amp;v1</code>, v1 must be in memory. Other reasons for stack locals: not enough registers, or arrays and structs.</p>`},
{q:`What does <code>leaq 8(%rsp), %rdi</code> do here?`, opts:['Loads the value of v1 into %rdi','Passes the address &amp;v1 as the first argument','Allocates 8 bytes','Pops the return address','Saves %rdi'], a:1,
 exp:`<p>leaq computes the address %rsp+8, which is where v1 lives, and puts it in %rdi (argument 1 = p).</p>`},
{q:`Why does <code>addq $16, %rsp</code> appear before <code>ret</code>?`, opts:['To deallocate the frame so %rsp points at the return address again','To return 16','To skip the next instruction','To pop arguments 7 and 8','It is optional'], a:0,
 exp:`<p>ret pops whatever is at (%rsp). The frame must be released (%rsp restored) so the return address is on top.</p>`},

{block:'Recursive popcount', n:3, html:``, code:C`/* long pcount_r(unsigned long x) {
     if (x == 0) return 0;
     else return (x & 1) + pcount_r(x >> 1);  } */
pcount_r:
  movl  $0, %eax
  testq %rdi, %rdi
  je    .L6
  pushq %rbx
  movq  %rdi, %rbx
  andl  $1, %ebx
  shrq  %rdi
  call  pcount_r
  addq  %rbx, %rax
  popq  %rbx
.L6:
  ret`},
{q:`What does <code>pcount_r(13)</code> return?`, fill:'3', exp:`<p>13 = 1101<sub>2</sub>, which has three 1 bits.</p>`},
{q:`Why does pcount_r save and use <code>%rbx</code> for <code>x &amp; 1</code>?`, opts:['%rbx is callee-saved, so its value survives the recursive call; pcount_r must push the caller\'s %rbx first and pop it before returning','%rbx is the return register','%rbx is an argument register','It is faster than %rax','%rbx cannot be modified by the callee, so no push is needed'], a:0,
 exp:`<p>The bit must survive the recursive call. A callee-saved register is guaranteed to come back unchanged, but pcount_r is itself a callee, so it must save its caller's %rbx (pushq) and restore it (popq).</p>`},
{q:`For <code>pcount_r(6)</code>, how many times is <code>pushq %rbx</code> executed?`, fill:'3', exp:`<p>The calls are with x = 6, 3, 1, 0. Every call with x != 0 pushes, so 3 pushes. The x = 0 call returns immediately via je.</p>`},
{q:`Each recursive call gets its own stack frame, with its own return address and saved state.`, tf:true,
 exp:`<p><strong>True.</strong> The stack discipline (last in, first out) makes recursion work without special handling.</p>`},
{q:`A caller keeps an important value in <code>%rdx</code> and then calls a function. What must happen for the value to survive?`, opts:['Nothing; the callee must preserve %rdx','The caller must save %rdx (e.g. push it or move it to a callee-saved register) before the call and restore it after','The callee must push %rdx','Store it in %rax','Use %rip'], a:1,
 exp:`<p>%rdx is <strong>caller-saved</strong>: the callee may overwrite it. The caller must protect it, or keep the value in a callee-saved register such as %rbx.</p>`},

/* ====================================================== 11 */
{sec:'s11', title:'11. Buffer overflow & defenses', src:'Slides 24 (Buffer Overflow) &middot; Attack lab intro'},
{block:'echo', n:3, html:`The stack frame of <code>echo</code>: buf starts at %rsp, and the return address is just above the 24-byte frame.`, code:C`void echo() {
  char buf[4];   /* Way too small! */
  gets(buf);
  puts(buf);
}

echo:
  subq  $24, %rsp
  movq  %rsp, %rdi
  call  gets
  movq  %rsp, %rdi
  call  puts
  addq  $24, %rsp
  ret`},
{q:`What is the maximum number of characters you can type without corrupting the return address?`, fill:'23', exp:`<p>gets writes the characters <strong>plus a '\\0' terminator</strong>. 23 characters + null = 24 bytes, which fills offsets 0&ndash;23 exactly. The overflow past buf[3] lands in unused frame space, which isn't critical.</p>`},
{q:`If you type exactly 24 characters, what happens?`, opts:['Nothing is overwritten','The null terminator overwrites the low byte of the return address','The whole return address is replaced','The canary detects it','gets refuses the input'], a:1,
 exp:`<p>The 25th byte written (the '\\0') lands on the lowest byte of the return address. In the slides the program still "seemed to work" by pure luck: the corrupted address happened to land in another function's code.</p>`},
{q:`With 25 characters, the slides' demo:`, opts:['Works fine','Gives a segmentation fault','Prints a canary error','Returns to main normally','Prints nothing'], a:1,
 exp:`<p>Two bytes of the return address are now corrupted, so ret jumps somewhere invalid.</p>`},
{q:`If <code>char buf[8]</code> is placed at <code>8(%rsp)</code> after <code>subq $24, %rsp</code> (return address at 24(%rsp)), what is the maximum number of input characters that leaves the return address untouched?`, fill:'15',
 exp:`<p>From buf (offset 8) to the return address (offset 24) is 16 bytes, so 15 characters + '\\0'. Always measure from the buffer's start to the return address slot.</p>`},
{q:`With the stack protector, a canary sits at 8(%rsp), just above <code>buf[4]</code> at (%rsp). What is the maximum input length that does NOT trigger "stack smashing detected"?`, fill:'7',
 exp:`<p>Bytes 0&ndash;7 are safe: 7 characters + null = 8 bytes. With 8 characters the null lands on the canary at offset 8. That matches the slides: "0123456" works, "01234567" is detected.</p>`},
{q:`Which C library functions are unsafe because they don't limit how much they write? Select the best answer.`, opts:['gets, strcpy, and scanf with %s','fgets, strncpy, and scanf with %10s','printf and puts','malloc and free','strlen and strcmp'], a:0,
 exp:`<p>Use <code>fgets</code> instead of gets, <code>strncpy</code> instead of strcpy, and <code>%ns</code> (e.g. %10s) instead of %s.</p>`},
{q:`Which is NOT a system-level protection against buffer overflow attacks?`, opts:['Stack randomization (ASLR)','Stack canaries (stack protector)','Non-executable stack regions','Replacing gets with fgets','None of these is a protection'], a:3,
 exp:`<p>Replacing gets with fgets is a <em>programmer-level</em> fix in your own code. The three <strong>system-level</strong> protections are stack randomization, stack corruption detection (canaries), and limiting executable code regions.</p>`},
{q:`The canary value is the same every time the program runs.`, tf:false,
 exp:`<p><strong>False.</strong> It's generated randomly each run and read from a protected segment (<code>%fs:40</code>), so an attacker can't predict it.</p>`},
{q:`Where is the canary placed?`, opts:['Just beyond the character buffer, between it and the return address','At the bottom of the heap','In %rbx','After the return address','In the text segment'], a:0,
 exp:`<p>An overflow from the buffer must pass through the canary before reaching the return address. Before ret, the code checks <code>xorq %fs:40, %rax</code> and calls <code>__stack_chk_fail</code> if the value changed.</p>`},
{q:`What does stack randomization (ASLR) make harder?`, opts:['Predicting the address of the injected code on the stack','Writing past the end of the buffer','Calling gets','Using recursion','Executing code in the text segment'], a:0,
 exp:`<p>A random amount of stack space is allocated at program start, so stack addresses change each run. An attacker can't hard-code the buffer's address as the new return address.</p>`},
{q:`A return-oriented programming (ROP) attack injects new machine code onto the stack.`, tf:false,
 exp:`<p><strong>False.</strong> ROP chains <em>gadgets</em>, existing instruction sequences ending in <code>ret</code> (c3), by filling the stack with their addresses. It doesn't rely on code injection.</p>`},
{q:`Which protection does ROP specifically defeat?`, opts:['Non-executable stack','Stack canaries','Bounds checking with fgets','Using strncpy','None'], a:0,
 exp:`<p>ROP never executes stack bytes, only existing code, so marking the stack non-executable doesn't stop it. (Canaries can still detect the overwrite, and randomization makes gadget addresses harder to find.)</p>`},
{q:`In a code-injection attack, what overwrites the return address?`, opts:['The address of the exploit code (e.g. the start of buf)','The canary','0x00000000','The address of main','%rbp'], a:0,
 exp:`<p>The input holds exploit byte codes (padded with nops), followed by a new return address pointing back into the buffer. When the function executes ret, it jumps into the attacker's code.</p>`},
{q:`In the x86-64 Linux memory layout, where do global variables, static variables, and string constants live?`, opts:['Stack','Heap','Data','Text','Shared libraries','Registers'], a:2,
 exp:`<p>Stack: local variables (8MB limit, highest addresses). Heap: malloc/calloc. Data: statically allocated globals, statics, and string constants. Text: read-only machine instructions (around 0x400000).</p>`},
{q:`Where does memory returned by <code>malloc</code> come from?`, opts:['Stack','Heap','Data','Text','Shared libraries','Registers'], a:1,
 exp:`<p>The heap is allocated dynamically as needed. (In the slides, very large mallocs landed near the shared libraries, but they are still dynamic heap-style allocations.)</p>`},
{q:`What is the typical stack size limit cited in the slides?`, opts:['64 KB','1 MB','8 MB','2 GB','Unlimited'], a:2,
 exp:`<p>The runtime stack has an 8MB limit, so unbounded recursion overflows it.</p>`},
{q:`<code>typedef struct { int a[2]; double d; } struct_t;</code> where <code>fun(i)</code> sets <code>s.d = 3.14; s.a[i] = 1073741824;</code> and returns s.d. Why does <code>fun(2)</code> return 3.1399998664856 instead of 3.14?`, opts:['a[2] is out of bounds and overwrites the low 4 bytes of d','The compiler rounds doubles','a[2] overwrites the return address','d is stored before a in memory','Floating point is non-deterministic'], a:0,
 exp:`<p>C does no bounds checking. a[2] is at offset 8, which is d's low-order bytes (little endian), so d changes slightly. a[3] hits d's high bytes (giving 2.00000061035156), and a[6] reaches critical state, causing a segmentation fault.</p>`},
{q:`The 1988 Internet worm exploited a buffer overflow in fingerd, which read the client's argument using:`, opts:['gets()','fgets()','strncpy()','scanf("%10s")','read() with a length'], a:0,
 exp:`<p>The phony argument contained exploit code, padding, and a new return address. The worm infected about 6000 computers (around 10% of the Internet) within hours.</p>`},
{q:`A virus can run independently and propagate itself to other machines.`, tf:false,
 exp:`<p><strong>False.</strong> That describes a <em>worm</em>. A virus adds itself to other programs and can't run on its own.</p>`},

/* ====================================================== 12 */
{sec:'s12', title:'12. Optimization (possible: lecture was Nov 6)', src:'Slides 26 (Optimization)'},
{q:`Moving <code>n*i</code> out of an inner loop (computing it once instead of every iteration) is called:`, opts:['Code motion','Reduction in strength','Loop unrolling','Memory aliasing','Profiling'], a:0,
 exp:`<p>Code motion reduces how often a computation with the same result is performed. Example: <code>int ni = n*i;</code> before the j loop.</p>`},
{q:`Replacing <code>16*x</code> with <code>x &lt;&lt; 4</code> is called:`, opts:['Code motion','Reduction in strength','Common subexpression sharing','Inlining','Aliasing'], a:1,
 exp:`<p>Reduction in strength replaces a costly operation with a cheaper one (a shift instead of a multiply, or an add instead of 2*x). The benefit depends on the machine.</p>`},
{q:`Rewriting four neighbor index expressions to reuse <code>inj = i*n + j</code> reduces the number of multiplications from 3 to:`, opts:['0','1','2','3','4'], a:1,
 exp:`<p>Sharing common subexpressions: compute i*n once and use inj&plusmn;n and inj&plusmn;1.</p>`},
{q:`What are the two main <strong>optimization blockers</strong> in the slides?`, opts:['Procedure calls and memory aliasing','Loops and recursion','Structs and unions','Signed and unsigned integers','Registers and caches'], a:0,
 exp:`<p>The compiler must stay conservative. A call could have side effects, and two pointers could refer to the same memory (aliasing), so it can't safely move or remove those operations.</p>`},
{q:`<code>for (i = 0; i &lt; strlen(s); i++)</code> in <code>lower()</code> makes the function:`, opts:['O(1)','O(log N)','O(N)','O(N&sup2;)','O(2^N)'], a:3,
 exp:`<p>strlen is O(N) and is called on every one of the N iterations, giving quadratic time. Moving <code>len = strlen(s)</code> before the loop (lower2) makes it linear.</p>`},
{q:`Why can't the compiler move the <code>strlen</code> call out of the loop by itself?`, opts:['The function could have side effects or return different values (and lower modifies the string); the compiler treats calls as black boxes','strlen is a macro','The loop variable is an int','It would change the asymptotic complexity','Compilers never move code'], a:0,
 exp:`<p>The compiler can't prove that strlen returns the same value each time. lower changes s, and strlen might be defined elsewhere or modify global state. Fixes: do your own code motion, or use inline functions (-O2).</p>`},
{q:`Optimizing compilers often improve a program's asymptotic (Big-O) efficiency.`, tf:false,
 exp:`<p><strong>False.</strong> They "very rarely improve asymptotic efficiency." Choosing the right algorithm is up to the programmer.</p>`},
{q:`An optimization may change program behavior as long as it only does so in pathological cases.`, tf:false,
 exp:`<p><strong>False.</strong> The fundamental constraint is that optimizations must not change program behavior, <em>even</em> in pathological conditions. When in doubt, the compiler stays conservative.</p>`},
{q:`<code>sum_rows1</code> writes <code>b[i] += a[i*n+j]</code> to memory on every iteration because:`, opts:['a and b might overlap (memory aliasing), so removing the intermediate writes could change the result','Doubles cannot be kept in registers','The loop is too short','b is a global variable','The compiler is set to -O0'], a:0,
 exp:`<p>If B = A+3, every write to b[i] changes elements of a that are read later. With A = {0,1,2,4,8,16,32,64,128}, the result is B = [3, 22, 224]. The fix (sum_rows2) accumulates in a local <code>val</code> and writes b[i] once.</p>`},
{q:`Which gcc flag enables profiling for gprof?`, fill:'-pg', exp:`<p><code>gcc -O2 -pg prog.c -o prog</code>, then <code>./prog</code> (writes gmon.out), then <code>gprof prog</code>. It samples by interrupting the program about every 10ms.</p>`},
{q:`In the Shakespeare word-count profiling example, what was the first and biggest improvement?`, opts:['Replacing insertion sort with quicksort (qsort)','A bigger hash table','A better hash function','Moving strlen out of lower','Iterative list insertion'], a:0,
 exp:`<p>sort_words took about 87% of the time, so changing the algorithm was the big win. Later steps: iter-last list insertion, a bigger table (1021 to 10,007 buckets), a better hash, and a linear lower.</p>`},
{q:`Profiling (gprof) is consistently accurate only for programs that run for more than about:`, opts:['10 ms','100 ms','3 seconds','1 minute','1 hour'], a:2,
 exp:`<p>Timing uses statistical sampling, so short runs give rough results. The profile also only reflects the data used in that run.</p>`},
{q:`Which of the following is a low-level optimization that takes advantage of hardware parallelism?`, opts:['Loop unrolling and multiple accumulators','Choosing quicksort over insertion sort','Adding comments','Using gets','Using recursion'], a:0,
 exp:`<p>Loop unrolling, multiple accumulators and reassociation (instruction-level parallelism), conditional data transfers, and parallel threads. These tend to reduce readability.</p>`},
];

/* ---------------- shared rendering ---------------- */
const G2 = (() => {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const L = 'ABCDEFGH';
  const block = it => `<div class="qb-block"><div class="bt">Beginning of block: ${it.block}</div>${it.html || ''}${it.code ? '<pre><code>' + esc(it.code) + '</code></pre>' : ''}</div>`;
  function card(it, n, extra) {
    let fmt, opts = '', key;
    if (it.tf !== undefined) {
      fmt = 'True / False';
      opts = ['True','False'].map((o,i) => `<li class="${(i===0)===it.tf?'ok':''}"><span class="L">${L[i]}.</span><span>${o}</span></li>`).join('');
      key = `Answer: ${it.tf ? 'True' : 'False'}`;
    } else if (it.fill !== undefined) {
      fmt = 'Fill in the blank';
      key = `Answer: <code>${esc(it.fill)}</code>` + (it.alt ? ` <span style="color:var(--text-faint);font-weight:400">(also accept: ${esc(it.alt)})</span>` : '');
    } else {
      const multi = Array.isArray(it.a);
      fmt = multi ? `Select all (${it.opts.length} choices)` : `Multiple choice (${it.opts.length})`;
      opts = it.opts.map((o,i) => `<li class="${(multi ? it.a.includes(i) : it.a===i)?'ok':''}"><span class="L">${L[i]}.</span><span>${o}</span></li>`).join('');
      key = 'Answer: ' + (multi ? it.a.map(i => L[i]).join(', ') : `${L[it.a]}. ${it.opts[it.a]}`);
    }
    return `<div class="qb-q"><div class="qh"><span class="qn">${n}.</span><div class="qt">${it.q}</div><span class="fmt">${extra ? extra + ' &middot; ' : ''}${fmt}</span></div>`
      + (it.code ? '<pre><code>' + esc(it.code) + '</code></pre>' : '')
      + (opts ? `<ul class="qb-opts">${opts}</ul>` : '')
      + `<button class="qb-reveal" type="button">Reveal answer</button>`
      + `<div class="qb-ans"><div class="key">${key}</div><div class="exp">${it.exp}</div></div></div>`;
  }
  return { esc, block, card };
})();
