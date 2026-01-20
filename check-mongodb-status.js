#!/usr/bin/env node
/**
 * MongoDB Atlas Cluster Status Checker
 * This script checks if the MongoDB Atlas cluster is reachable via DNS
 */

import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);

const clusterName = 'nullscape.gpy7uvl.mongodb.net';
const srvRecord = `_mongodb._tcp.${clusterName}`;

console.log('\n🔍 Checking MongoDB Atlas Cluster Status...\n');
console.log(`Cluster: ${clusterName}`);
console.log(`SRV Record: ${srvRecord}\n`);

// Test 1: DNS Resolution
console.log('Test 1: DNS Resolution');
console.log('─'.repeat(50));

try {
  const records = await resolveSrv(srvRecord);
  console.log('✅ DNS Resolution: SUCCESS');
  console.log(`   Found ${records.length} SRV record(s):`);
  records.forEach((record, index) => {
    console.log(`   ${index + 1}. ${record.name}:${record.port} (priority: ${record.priority}, weight: ${record.weight})`);
  });
  console.log('\n✅ Cluster appears to be RUNNING and reachable');
  console.log('   → Connection string should work');
  console.log('   → Check your MONGODB_URI username/password');
} catch (error) {
  console.log('❌ DNS Resolution: FAILED');
  console.log(`   Error: ${error.message}`);
  console.log(`   Code: ${error.code}\n`);
  
  if (error.code === 'ENOTFOUND') {
    console.log('🚨 DIAGNOSIS: Cluster is UNREACHABLE\n');
    console.log('Possible causes:');
    console.log('   1. Cluster is PAUSED');
    console.log('      → Go to https://cloud.mongodb.com');
    console.log('      → Check cluster status');
    console.log('      → Click "Resume" if paused\n');
    
    console.log('   2. Cluster was DELETED or RENAMED');
    console.log('      → Check if cluster still exists in Atlas');
    console.log('      → Get new connection string from Atlas\n');
    
    console.log('   3. Cluster name is INCORRECT');
    console.log('      → Verify cluster name in MongoDB Atlas');
    console.log('      → Update MONGODB_URI in Render Dashboard\n');
    
    console.log('   4. DNS propagation delay');
    console.log('      → Wait 5-10 minutes if you just resumed');
    console.log('      → Try again later\n');
  } else {
    console.log('   Unexpected DNS error. Check network connectivity.');
  }
}

// Test 2: Check cluster host directly
console.log('\nTest 2: Cluster Host Connectivity');
console.log('─'.repeat(50));

import http from 'http';

function checkHost(hostname) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: hostname,
      port: 27017,
      method: 'HEAD',
      timeout: 5000,
    }, (res) => {
      resolve({ reachable: true, statusCode: res.statusCode });
    });
    
    req.on('error', (error) => {
      resolve({ reachable: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ reachable: false, error: 'Connection timeout' });
    });
    
    req.end();
  });
}

const shardHosts = [
  `${clusterName.replace('.mongodb.net', '-shard-00-00.mongodb.net')}`,
  `${clusterName.replace('.mongodb.net', '-shard-00-01.mongodb.net')}`,
  `${clusterName.replace('.mongodb.net', '-shard-00-02.mongodb.net')}`,
];

console.log('Testing cluster shard hosts...');
for (const host of shardHosts) {
  const result = await checkHost(host);
  if (result.reachable) {
    console.log(`   ✅ ${host} - Reachable`);
  } else {
    console.log(`   ❌ ${host} - Not reachable (${result.error || 'timeout'})`);
  }
}

console.log('\n📋 Next Steps:');
console.log('─'.repeat(50));
console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com');
console.log('2. Navigate to: Database → Clusters');
console.log('3. Check the status of your cluster:');
console.log('   - If "Paused" → Click "Resume" button');
console.log('   - If missing → Cluster was deleted');
console.log('   - If status is "Running" → Check Network Access settings');
console.log('4. Get correct connection string:');
console.log('   - Click "Connect" → "Connect your application"');
console.log('   - Copy the connection string');
console.log('   - Replace <password> and <dbname>');
console.log('   - Update MONGODB_URI in Render Dashboard');
console.log('5. Verify Network Access:');
console.log('   - Atlas → Network Access → Add IP Address');
console.log('   - Add: 0.0.0.0/0 (allows all IPs for Render)\n');
