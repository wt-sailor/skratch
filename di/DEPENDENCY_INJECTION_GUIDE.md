# Dependency Injection Guide - Computer Module

## Overview

This guide explains the **Dependency Injection (DI)** pattern used in the `computer` module. DI is a design pattern that helps manage dependencies between classes and services in your application.

## What is Dependency Injection?

Dependency Injection is a technique where:
- A class doesn't create the objects it needs (dependencies)
- Instead, dependencies are **provided/injected** into the class
- This makes code more flexible, testable, and maintainable

**In simple terms:** Instead of a class saying "I'll create my own tools," DI says "Here are the tools you need—I'll give them to you."

---

## Architecture Overview

The computer module demonstrates DI through a **hierarchical service structure**:

```
ComputerModule (Root)
    ├── ComputerController
    │   ├── CpuService (injected)
    │   └── DiskService (injected)
    │
    ├── CpuModule
    │   ├── CpuService
    │   └── PowerModule
    │       └── PowerService
    │
    └── DiskModule
        ├── DiskService
        └── PowerModule
            └── PowerService
```

---

## Key Concepts

### 1. **@Injectable() Decorator**
Marks a class as a **service** that can be injected into other classes.

```typescript
@Injectable()
export class PowerService {
  supplyPower(watts: number) {
    console.log('Power supplied: ' + watts + ' watts');
  }
}
```

**Why?** NestJS needs to know which classes can be injected as dependencies.

---

### 2. **Module - @Module() Decorator**
Organizes related services, controllers, and their dependencies.

```typescript
@Module({
  providers: [PowerService],      // Services created by this module
  exports: [PowerService],         // Services available to other modules
})
export class PowerModule {}
```

**Module Properties:**
- **`providers`**: Services/classes managed by this module (created here)
- **`imports`**: Other modules whose services we need to use
- **`exports`**: Services we want to make available to other modules
- **`controllers`**: HTTP endpoint handlers for this module

---

### 3. **Constructor Injection**
Dependencies are injected through the class constructor.

```typescript
@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}
  
  compute(a: number, b: number) {
    this.powerService.supplyPower(10);  // Use injected service
    return a + b;
  }
}
```

**What happens?**
1. NestJS sees `PowerService` in the constructor
2. NestJS finds `PowerService` from imported modules
3. NestJS creates/provides an instance to `CpuService`

---

## Detailed Flow: How It Works

### Step 1: PowerModule (Foundation)
```typescript
@Module({
  providers: [PowerService],
  exports: [PowerService],  // "Other modules can use me"
})
export class PowerModule {}
```
- **Creates** `PowerService`
- **Exports** it so other modules can use it

---

### Step 2: CpuModule (Depends on PowerModule)
```typescript
@Module({
  providers: [CpuService],
  imports: [PowerModule],     // "I need PowerService from PowerModule"
  exports: [CpuService],      // "Other modules can use me"
})
export class CpuModule {}
```

**CpuService needs PowerService:**
```typescript
@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}
  // powerService is automatically injected by NestJS
}
```

**How it works:**
1. Module imports `PowerModule`
2. `PowerModule` exports `PowerService`
3. `CpuService` requests `PowerService` in constructor
4. NestJS provides it automatically ✅

---

### Step 3: DiskModule (Also depends on PowerModule)
```typescript
@Module({
  providers: [DiskService],
  imports: [PowerModule],
  exports: [DiskService],
})
export class DiskModule {}
```

**DiskService also uses PowerService:**
```typescript
@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}
  // Same PowerService instance is injected
}
```

---

### Step 4: ComputerModule (Uses Both)
```typescript
@Module({
  controllers: [ComputerController],
  imports: [CpuModule, DiskModule],  // Import both modules
})
export class ComputerModule {}
```

**ComputerController orchestrates everything:**
```typescript
@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,      // Injected from CpuModule
    private diskService: DiskService,    // Injected from DiskModule
  ) {}

  @Get()
  run() {
    return [
      this.cpuService.compute(5, 10),   // Uses CPU service
      this.diskService.getData(),        // Uses Disk service
    ];
  }
}
```

---

## Import vs Export Explained

### **imports** = Dependencies (Incoming)
"I need these modules"
```typescript
imports: [PowerModule, CpuModule]
```

### **exports** = Services (Outgoing)
"Other modules can use these services"
```typescript
exports: [PowerService]
```

### **Dependency Chain:**
```
ComputerModule
    ↓ imports
  ├─ CpuModule ──┐
  │   ↓ imports  │
  │   PowerModule│
  │   ↑ exports──┤
  └─ DiskModule─┘
```

---

## Complete Execution Flow

When you call `GET /computer`:

```
1. HTTP Request → ComputerController.run()
2. ComputerController needs CpuService and DiskService
3. CpuService is injected (from CpuModule)
   └─ CpuService needs PowerService
      └─ PowerService is injected (from PowerModule)
4. DiskService is injected (from DiskModule)
   └─ DiskService needs PowerService
      └─ PowerService is injected (same instance from PowerModule)
5. Controller calls:
   - cpuService.compute(5, 10) → returns 15
   - diskService.getData() → returns 'data!!!!!'
6. Response: [15, 'data!!!!!']
```

---

## Key Takeaways

| Concept | Purpose | Example |
|---------|---------|---------|
| `@Injectable()` | Marks service as injectable | `PowerService`, `CpuService` |
| `@Module()` | Organizes services & controllers | `ComputerModule`, `CpuModule` |
| `providers` | Services created/managed by module | `providers: [CpuService]` |
| `imports` | Modules we depend on | `imports: [PowerModule]` |
| `exports` | Services available to other modules | `exports: [CpuService]` |
| Constructor Injection | Inject dependencies via constructor | `constructor(private powerService: PowerService)` |

---

## Benefits of This Pattern

✅ **Loose Coupling** - Services don't create their own dependencies  
✅ **Easy Testing** - Can inject mock services for tests  
✅ **Reusability** - Services can be shared across modules  
✅ **Maintainability** - Clear dependency relationships  
✅ **Scalability** - Easy to add new services and modules  

---

## Quick Reference

### Creating a New Service
```typescript
@Injectable()
export class MyService {}
```

### Creating a New Module
```typescript
@Module({
  providers: [MyService],
  imports: [OtherModule],
  exports: [MyService],
})
export class MyModule {}
```

### Injecting a Dependency
```typescript
constructor(private myService: MyService) {}
```

### Using Injected Service
```typescript
this.myService.someMethod();
```

---

## Visual Summary

```
┌─────────────────────────────────────────┐
│         ComputerModule (Root)           │
├─────────────────────────────────────────┤
│ controllers: [ComputerController]       │
│ imports: [CpuModule, DiskModule]        │
└─────────────────────────────────────────┘
           ↓                    ↓
    ┌────────────┐        ┌────────────┐
    │ CpuModule  │        │DiskModule  │
    ├────────────┤        ├────────────┤
    │ providers: │        │ providers: │
    │ [CpuServ.] │        │[DiskServ.] │
    │ imports:   │        │ imports:   │
    │[PowerMod.] │        │[PowerMod.] │
    │ exports:   │        │ exports:   │
    │[CpuServ.]  │        │[DiskServ.] │
    └────────────┘        └────────────┘
           ↓                    ↓
    ┌─────────────────────────────────┐
    │      PowerModule                │
    ├─────────────────────────────────┤
    │ providers: [PowerService]       │
    │ exports: [PowerService]         │
    └─────────────────────────────────┘
```

---

## Questions?

**Q: Why do we need to export services?**  
A: Without exports, other modules can't access the services. Exports make services available outside the module.

**Q: Can multiple modules use the same service?**  
A: Yes! If a module exports a service, any module that imports it gets the same instance.

**Q: What happens if we forget to import a module?**  
A: NestJS will throw an error saying the dependency can't be found.

**Q: Is there a singleton pattern?**  
A: Yes! By default, services are singletons (one instance per application).
